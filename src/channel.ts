import { ChannelClient, ClientConfig, RequestSubscriptionResponse } from '@iota/is-client';
import chalk from 'chalk';
import fs from 'fs';
import nconf from 'nconf';
import os, { type } from 'os';
import path from 'path';
import { writeOutput } from './utils';

export const createChannel = async (name: string, options: { type: string; source: string; identityFile: string, outputFile?: string }) => {
    try {
        const { type, source, identityFile, outputFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.create({ name, topics: [{ type, source }] });
        writeOutput('Created channel:', response, outputFile);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const writeChannel = async (address: string, options: { identityFile: string; payload: string }) => {
    try {
        const { identityFile, payload } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.write(address, { payload });
        writeOutput('Message written to channel: ' + address, response);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const readChannel = async (
    address: string,
    options: {
        identityFile: string;
        limit: string;
        index: string;
        asc: string;
        startDate: string;
        endDate: string;
    }
) => {
    try {
        const { identityFile, limit, index, asc, startDate, endDate } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.read(address, {
            limit: limit ? Number(limit) : undefined,
            index: index ? Number(index) : undefined,
            asc: asc ? Boolean(asc) : undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });
        writeOutput('Channel data:', response);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const subscribe = async (address: string, options: { identityFile: string }) => {
    try {
        const { identityFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        const subscription = await api.requestSubscription(address);
        writeOutput('Subscription', subscription);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const authorize = async (address: string, did: string, options: { identityFile: string }) => {
    try {
        const { identityFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        const subscription = await api.findSubscription(address, did);
        if (!subscription) {
            console.error(chalk.bold.green('Subscription not found'))
            return;
        }
        console.error(chalk.bold.green('Subscription found: authorizing...'));
        let response = await api.authorizeSubscription(address, {
            subscriptionLink: subscription.subscriptionLink,
            id: subscription.id
        })
        writeOutput('Identity ' + did + " authorized", response);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

const getAuthenticatedApi = async (pathToIdentityFile: string): Promise<ChannelClient> => {
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
        throw Error(chalk.bold.red('The supplied file has no doc.id or nor key.secret attribute.'));
    }
    await api.authenticate(identity.doc.id, identity.key.secret);
    return api;
};

const getApi = (): ChannelClient => {
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
    return new ChannelClient(config);
};
