import { IdentityClient, ClientConfig } from '@iota/is-client';
import chalk from 'chalk';
import fs from 'fs';
import nconf from 'nconf';
import os from 'os';
import path from 'path';
import { parseInput, writeOutput } from './utils.js';

export const createIdentity = async (params: { identityFile?: string, outputFile: string }) => {
    const { identityFile, outputFile } = params;
    try {
        const api = getApi();
        let data =  await parseInput(identityFile);
        const response = await api.create(data.username, data.claimType, data.claim);
        writeOutput("Identity created:", response, outputFile);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const searchIdentity = async (username: string, options: { identityFile: string, outputFile: string }) => {
    try {
        const { identityFile, outputFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.search({ username });
        writeOutput('Searched identities: ', response, outputFile);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const findIdentity = async (identityId: any, options: { identityFile: string, outputFile: string }) => {
    try {
        const { identityFile, outputFile } = options
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.find(identityId);
        if (!response) {
            return console.log(chalk.bold.red('No identity found with identity id: ', identityId));
        }
        writeOutput('Found identity: ', response, outputFile)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const addIdentity = async (pathToAddIdentityFile: string, options: { identityFile: string }) => {
    try {
        const identity = parseInput(pathToAddIdentityFile);
        const api = await getAuthenticatedApi(options.identityFile);
        await api?.add(identity);
        writeOutput('Added identity to bridge.');
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const removeIdentity = async (identityId: string, options: { identityFile: string; revokeCredential: boolean }) => {
    try {
        const { identityFile, revokeCredential } = options;
        const api = await getAuthenticatedApi(identityFile);
        revokeCredential ? await api?.remove(identityId, true) : await api?.remove(identityId);
        writeOutput(`Identity with identity id '${identityId}' removed.`);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const updateIdentity = async (updateFile: string, options: { identityFile: string }) => {
    try {
        const updateIdentity = parseInput(updateFile);
        const api = await getAuthenticatedApi(options.identityFile);
        await api?.update(updateIdentity);
        writeOutput('Identity updated with data: ', updateFile);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const latestDocument = async (identityId: string, options: { identityFile: string, outputFile: string }) => {
    try {
        const { identityFile, outputFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.latestDocument(identityId);
        if (!response) {
            return console.log(chalk.bold.red('No identity found with identity id: ', identityId));
        }
        writeOutput('Found identity', response, outputFile);
    } catch (e: any) {
        console.log(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.log(chalk.bold.red(e.response.data.error));
    }
};

export const getTrustedAuthorities = async (options: { identityFile: string, outputFile: string }) => {
    try {
        const { identityFile, outputFile } = options
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.getTrustedAuthorities();
        writeOutput('Trusted authorities: ', response, outputFile);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const addTrustedAuthority = async (authorityId: string, options: { identityFile: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        await api?.addTrustedAuthority(authorityId);
        writeOutput(`Added identity with identity id '${authorityId}' as a trusted root.`);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const removeTrustedAuthority = async (authorityId: string, options: { identityFile: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        await api?.removeTrustedAuthority(authorityId);
        writeOutput(`Removed identity with identity id '${authorityId}' from trusted roots.`);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const createCredential = async (options: { identityFile: string; did: string, credentialFile?: string, outputFile: string }) => {
    try {
        const { identityFile, did, credentialFile, outputFile } = options;
        let credentialData = parseInput(credentialFile);
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

        let identity = parseInput(identityFile);
        const adminIdentityPublic = await api.find(identity.doc.id);
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
        const credential = parseInput(credentialFile);
        const api = await getAuthenticatedApi(options.identityFile);
        const response = await api?.checkCredential(credential);
        writeOutput('Verification result: ', response);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const revokeCredential = async (signatureValue: string, options: { identityFile: string; }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        await api?.revokeCredential({ signatureValue });
        writeOutput('Revoked credential.');
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const getJwt = async (options: { identityFile: string, outputFile: string }) => {
    try {
        const { identityFile, outputFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        writeOutput('Returned JWT: ', api?.jwtToken, outputFile);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const verifyJwt = async (jwt: string, options: { identityFile: string; }) => {
    try {
        const api = await getAuthenticatedApi(options.identityFile);
        const response = await api?.verifyJwt({ jwt });
        if (response?.isValid) {
            console.log(chalk.bold.green('JWT is valid.'));
        } else {
            console.log(chalk.bold.red(response?.error));
        }
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

const getAuthenticatedApi = async (identityFile: string): Promise<IdentityClient> => {
    let api = getApi();
    let identity;
    try {
        identity = parseInput(identityFile);
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

