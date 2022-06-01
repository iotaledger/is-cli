import { ChannelClient, ClientConfig, Subscription, SubscriptionUpdate, ValidateBody } from '@iota/is-client';
import chalk from 'chalk';
import fs from 'fs';
import nconf from 'nconf';
import os, { type } from 'os';
import path from 'path';
import { writeOutput, parseInput } from './utils.js';

enum ChannelType {
    public = "public",
    private = "private"
}

export const createChannel = async (name: string, options: { type: string; source: string; identityFile: string, outputFile: string, publicChannel?: boolean }) => {
    try {
        const { type, source, identityFile, outputFile, publicChannel } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.create({ name, type: publicChannel ? ChannelType.public : ChannelType.private , topics: [{ type, source }] });
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

export const readHistory = async (address: string, options: { identityFile: string, presharedKey: string, publicChannel: boolean, outputFile: string }) => {
    try {
        const { identityFile, presharedKey, publicChannel, outputFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.readHistory(address, presharedKey, publicChannel ? ChannelType.public : ChannelType.private);
        writeOutput('History: ', response, outputFile);
    } catch (e: any) {
        console.log(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.log(chalk.bold.red(e.response.data.error));
    }
}

export const readChannel = async (
    address: string,
    options: {
        identityFile: string,
        limit: string,
        index: string,
        asc: string,
        startDate: string,
        endDate: string,
        outputFile: string
    }
) => {
    try {
        const { identityFile, limit, index, asc, startDate, endDate, outputFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.read(address, {
            limit: limit ? Number(limit) : undefined,
            index: index ? Number(index) : undefined,
            asc: asc ? Boolean(asc) : undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });
        writeOutput('Channel data:', response, outputFile);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const reimportChannel = async (address: string, options: { identityFile: string, seed?: string, subscriptionPassword?: string }) => {
    try {
        const { identityFile, seed, subscriptionPassword } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.reimport(address, { seed, subscriptionPassword });
        writeOutput('Reimport:', response);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const validateLogs = async (address: string, options: { identityFile: string, validateDataFile: string }) => {
    try {
        const { validateDataFile, identityFile } = options;
        const data: ValidateBody = parseInput(validateDataFile);
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.validate(address, data);
        writeOutput('Validation result:', response);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

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
        const response = await api.authorizeSubscription(address, {
            subscriptionLink: subscription.subscriptionLink,
            id: subscription.id
        })
        writeOutput('Identity ' + did + " authorized", response);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const addSubscription = async (address: string, options: { subscriberId: string, identityFile: string, subscriptionFile: string }) => {
    try {
        const { identityFile, subscriberId, subscriptionFile } = options;
        const subscription: Subscription = parseInput(subscriptionFile);
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.addSubscription(address, subscriberId, subscription);
        writeOutput(`Added subscription`, response)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const updateSubscription = async (address: string, options: { subscriberId: string, identityFile: string, subscriptionUpdateFile: string }) => {
    try {
        const { identityFile, subscriberId, subscriptionUpdateFile } = options;
        const subscriptionUpdate: SubscriptionUpdate = parseInput(subscriptionUpdateFile);
        const api = await getAuthenticatedApi(identityFile);
        await api?.updateSubscription(address, subscriberId, subscriptionUpdate);
        writeOutput(`Updated subscription`)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const removeSubscription = async (address: string, options: { subscriberId: string, identityFile: string }) => {
    try {
        const { identityFile, subscriberId } = options;
        const api = await getAuthenticatedApi(identityFile);
        await api?.removeSubscription(address, subscriberId);
        writeOutput(`Removed subscription`)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const revokeSubscription = async (address: string, options: { identityFile: string, subscriptionLink: string, subscriberId: string }) => {
    try {
        const { identityFile, subscriptionLink, subscriberId } = options;
        const api = await getAuthenticatedApi(identityFile);
        await api?.revokeSubscription(address, { subscriptionLink, id: subscriberId });
        writeOutput(`Revoked subscription`)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const findSubscription = async (address: string, options: { subscriberId: string, identityFile: string, outputFile: string }) => {
    try {
        const { identityFile, subscriberId, outputFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.findSubscription(address, subscriberId);
        writeOutput(`Found subscription: `, response, outputFile)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const findAllSubscriptions = async (address: string, options: { identityFile: string, isAuthorized?: boolean, outputFile: string }) => {
    try {
        const { identityFile, isAuthorized, outputFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.findAllSubscriptions(address, isAuthorized);
        writeOutput(`Found subscriptions`, response, outputFile)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const searchChannel = async (options: {
    identityFile: string,
    outputFile: string,
    authorId: string,
    name: string,
    channelType: ChannelType,
    topicType: string,
    topicSource: string,
    created: Date,
    latestMessage: Date,
    limit: number,
    index: number,
    ascending: boolean
}) => {
    try {
        const { identityFile, outputFile, ...searchCriteria } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.search(searchCriteria);
        writeOutput(`Found channel info based on search criteria`, response, outputFile);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const getChannelInfo = async (address: string, options: { identityFile: string, outputFile: string }) => {
    try {
        const { identityFile, outputFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.info(address);
        writeOutput(`Found channel info`, response, outputFile)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const addExistingChannel = async (options: { identityFile: string, channelFile: string }) => {
    try {
        const { identityFile, channelFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        const channel = parseInput(channelFile);
        await api?.add(channel);
        writeOutput(`Added channel info`)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const updateChannelInfo = async (options: { identityFile: string, channelUpdateFile: string }) => {
    try {
        const { identityFile, channelUpdateFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        const channelUpdate = parseInput(channelUpdateFile);
        await api?.update(channelUpdate);
        writeOutput(`Updated channel info`)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const removeChannelInfo = async (address: string, options: { identityFile: string }) => {
    try {
        const { identityFile } = options;
        const api = await getAuthenticatedApi(identityFile);
        await api?.remove(address);
        writeOutput(`Removed channel information from the database.`)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

const getAuthenticatedApi = async (identityFile: string): Promise<ChannelClient> => {
    let api = getApi();
    let identity;
    try {
        identity = parseInput(identityFile);
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
