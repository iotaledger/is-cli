import { IdentityClient, ClientConfig } from '@iota/is-client';
import chalk from 'chalk';
import fs from 'fs';
import nconf from 'nconf';
import os from 'os';
import path from 'path';
import { parseInput, writeOutput } from './utils';

export const createIdentity = async (params: { identity?: string, outputFile: string }) => {
    const { identity, outputFile } = params;
    try {
        const api = getApi();
        let data = parseInput(identity);
        const response = await api.create(data.username, data.claimType, data.claim);
        writeOutput("Identity created:", response, outputFile);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const searchIdentity = async (username: string, options: { identityFile: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        const response = await api?.search({ username });
        console.log(chalk.bold.green('Searched identities: '));
        console.log(JSON.stringify(response, null, 2));
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const findIdentity = async (identityId: any, options: { identityFile: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        const response = await api?.find(identityId);
        if (!response) {
            return console.log(chalk.bold.red('No identity found with identity id: ', identityId));
        }
        console.log(chalk.bold.green('Found identity: '));
        console.log(JSON.stringify(response, null, 2));
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const addIdentity = async (pathToAddIdentityFile: string, options: { identityFile: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        if (!fs.existsSync(pathToAddIdentityFile)) {
            throw Error(chalk.bold.red('The identity file does not exist.'));
        }
        const file = fs.readFileSync(pathToAddIdentityFile, 'utf8');
        await api?.add(JSON.parse(file));
        console.log(chalk.bold.green('Added identity to bridge.'));
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const removeIdentity = async (identityId: string, options: { identityFile: string; revoke: boolean }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        options.revoke ? await api?.remove(identityId, true) : await api?.remove(identityId);
        console.log(chalk.bold.green(`Identity with identity id '${identityId}' removed.`));
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const updateIdentity = async (updateFile: string, options: { identityFile: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        if (!fs.existsSync(updateFile)) {
            throw Error(chalk.bold.red('The update identity file does not exist.'));
        }
        const file = fs.readFileSync(updateFile, 'utf8');
        await api?.update(JSON.parse(file));
        console.log(chalk.bold.green('Identity updated with data: ', updateFile));
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const latestDocument = async (identityId: string, options: { identityFile: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        const response = await api?.latestDocument(identityId);
        if (!response) {
            return console.log(chalk.bold.red('No identity found with identity id: ', identityId));
        }
        console.log(chalk.bold.green('Found identity'));
        console.log(JSON.stringify(response, null, 2));
    } catch (e: any) {
        console.log(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.log(chalk.bold.red(e.response.data.error));
    }
};

export const getTrustedAuthorities = async (options: { identityFile: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        const response = await api?.getTrustedAuthorities();
        console.log(chalk.bold.green('Trusted authorities: '));
        console.log(JSON.stringify(response, null, 2));
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const addTrustedAuthority = async (authorityId: string, options: { identityFile: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        await api?.addTrustedAuthority(authorityId);
        console.log(chalk.bold.green(`Added identity with identity id '${authorityId}' as a trusted root.`));
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const removeTrustedAuthority = async (authorityId: string, options: { identityFile: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        await api?.removeTrustedAuthority(authorityId);
        console.log(chalk.bold.green(`Removed identity with identity id '${authorityId}' from trusted roots.`));
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const createCredential = async (options: { identityFile: string; did: string, credential?: string, outputFile: string }) => {
    try {
        const { identityFile, did, credential, outputFile } = options;
        let credentialData = parseInput(credential);
        const { credentialType, claimType, claim } = credentialData;
        let error = false;
        if (!credentialType) {
            console.error(chalk.bold.red("credentialType not present in credential file"));
            error = true;
        }
        if (!claimType) {
            console.error(chalk.bold.red("claimType not present in credential file"));
            error = true;
        }
        if (!claim) {
            console.error(chalk.bold.red("claim not present in credential file"));
            error = true;
        }
        if (error) {
            return;
        }
        const api = await getAuthenticatedApi(identityFile);

        let identityJSON = JSON.parse(fs.readFileSync(identityFile, { encoding: 'utf8', flag: 'r' }));
        const adminIdentityPublic = await api.find(identityJSON.doc.id);
        const identityCredential = adminIdentityPublic?.verifiableCredentials?.[0];
        
        const response = await api.createCredential(
            identityCredential,
            did,
            credentialType,
            claimType,
            claim
        );
        writeOutput('Created Verifiable Credential:', response, outputFile)
    }
    catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const checkCredential = async (credentialFile: string, options: { identityFile: string; }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        if (!fs.existsSync(credentialFile)) {
          throw Error(chalk.bold.red('The update identity file does not exist.'));
      }
        const file = fs.readFileSync(credentialFile, 'utf-8');
        const response = await api?.checkCredential(JSON.parse(file));
        console.log(chalk.bold.green('Verification result:'))
        console.log(JSON.stringify(response, null, 2));
    } catch (e: any) {
      console.error(chalk.bold.red(e.message));
      if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const revokeCredential = async (signatureValue: string, options: { identityFile: string; }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        await api?.revokeCredential({ signatureValue });
        console.log(chalk.bold.green('Revoked credential.'));
    } catch (e: any) {
      console.error(chalk.bold.red(e.message));
      if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

const getAuthenticatedApi = async (pathToIdentityFile: string): Promise<IdentityClient> => {
    let api = getApi();
    if (!fs.existsSync(pathToIdentityFile)) {
        throw Error(chalk.bold.red('The identity file does not exist.'));
    }
    let identity;
    try {
        identity = JSON.parse(fs.readFileSync(pathToIdentityFile, { encoding: 'utf8', flag: 'r' }));
    } catch (error: any) {
        throw Error(chalk.bold.red('The supplied file is in a readable .json format.'));
    }
    if (!identity?.doc?.id || !identity?.key?.secret) {
        throw Error(chalk.bold.red('The supplied file has no doc.id or no key.secret attribute.'));
    }
    await api.authenticate(identity.doc.id, identity.key.secret);
    return api;
};

const getApi = (): IdentityClient => {
    nconf.file({
        file: path.join(os.homedir(), '.iota-is.json')
    });

    const isGatewayUrl = nconf.get('isGatewayUrl');
    const ssiBridgeUrl = nconf.get('ssiBridgeUrl');
    const auditTrailUrl = nconf.get('auditTrailUrl');
    const apiVersion = nconf.get('apiVersion');
    const apiKey = nconf.get('apiKey');

    if (!isGatewayUrl && !(ssiBridgeUrl || auditTrailUrl)) {
        throw Error('isGatewayUrl or both ssiBridgeUrl AND auditTrailUrl are missing: run config command first');
    }

    const config: ClientConfig = {
        apiKey,
        isGatewayUrl,
        ssiBridgeUrl,
        auditTrailUrl,
        apiVersion
    };
    return new IdentityClient(config);
};

