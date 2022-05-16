import { KubeConfig, V1Pod, V1Service } from '@kubernetes/client-node';
import * as k8s from '@kubernetes/client-node';
import chalk from 'chalk';

function createMakeAdminJob(id: string, databaseUrl: string, databaseName: string) {
    const command = `db.getCollection("users").findOneAndUpdate({ "id": "${id}" }, { "$set": { "role": "Admin" } }, { "upsert": "false" })`;
    return {
        "apiVersion": "batch/v1",
        "kind": "Job",
        "metadata": {
            "generateName": "make-admin-",
            "labels": {
                "iota/cli": "make-admin"
            }
        },
        "spec": {
            "backoffLimit": 4,
            "template": {
                "spec": {
                    "containers": [{
                        "name": "setup-role",
                        "image": "docker.io/bitnami/mongodb:4.4.13-debian-10-r33",
                        "command": ["mongo", `${databaseUrl}/${databaseName}`, "--authenticationDatabase", "admin", "--eval", command]
                    }],
                    "restartPolicy": "Never"
                }
            }
        }
    }
}

/**
 * Retrieve configuration of Integration Services.
 * It need to be installed using helm-chart
 */
async function getISConfigMap(kc: KubeConfig, namespace: string, name: string) {
    const k8sApiCore = kc.makeApiClient(k8s.CoreV1Api);
    const response = await k8sApiCore.listNamespacedConfigMap(namespace)
    return response.body.items.filter(item => {
        const anns = item.metadata?.annotations;
        if (anns && anns['meta.helm.sh/release-name'] && anns['meta.helm.sh/release-name'] === name) {
            return true
        }
        return false;
    }).map(item => item.data);
}

/**
 * Retrieve info related to IS.
 * We are interested in the Mongo endpoint and the database name
 */
async function getISConfig(kc: KubeConfig, namespace: string, name: string) {
    let source = {}
    const config = await getISConfigMap(kc, namespace, name);
    config.forEach(item => {
        Object.assign(source, item);
    });
    return source;
}

/**
 * Launch a Job that will run a mongo script to update the Role of an
 * Identity to Admin.
 */
export const makeAdmin = async (params: { identity: string, deploymentName: string, namespace?: string }) => {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    let namespace = params.namespace ? params.namespace : "default";
    const infos = await getISConfig(kc, namespace, params.deploymentName) as any;
    if (!infos["DATABASE_URL"] || !infos["DATABASE_NAME"]) {
        console.error(chalk.bold.green("Impossible to retrieve Integration Service info"))
        console.error(chalk.bold.green("Please, be sure that Integration Services was installed"))
        console.error(chalk.bold.green("using Helm Chart (https://github.com/iotaledger/helm-charts)"))
        return;
    }
    const job = createMakeAdminJob(params.identity, infos["DATABASE_URL"], infos["DATABASE_NAME"]);
    const k8sApi = k8s.KubernetesObjectApi.makeApiClient(kc);
    await k8sApi.create(job);
    console.log(chalk.bold.blue(`Identity ${params.identity} (if exists) is now Admin (i.e. it can issue verifiable credentials)`));
    console.log(chalk.bold.blue(`You can clean up old "make-admin" commands with the following:`));
    console.log(chalk.bold.green(`kubectl delete job -n ${namespace} --selector "iota/cli=make-admin"`));
}
