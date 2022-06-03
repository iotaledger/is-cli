import { AccessRights, ChannelClient, ClientConfig, Subscription, SubscriptionUpdate, ValidateBody } from '@iota/is-client';
import chalk from 'chalk';
import fs from 'fs';
import nconf from 'nconf';
import os, { type } from 'os';
import path, { parse } from 'path';
import { writeOutput, parseInput, checkProperty } from './utils.js';

enum ChannelType {
    public = "public",
    private = "private"
}


export const createChannel = async (
    name: string,
    options: {
        type: string;
        source: string;
        identityFile: string,
        outputFile: string,
        publicChannel?: boolean,
        hasPresharedKey?: boolean,
        description: string
    }) => {
    try {
        const { type, source, identityFile, outputFile, publicChannel, hasPresharedKey, description } = options;
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.create({ name, description, hasPresharedKey, type: publicChannel ? ChannelType.public : ChannelType.private, topics: [{ type, source }] });
        writeOutput('Created channel:', response, outputFile);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const writeChannel = async (options: { identityFile: string; payload: string, channelFile: string }) => {
    try {
        const { identityFile, payload, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.write(channel?.channelAddress, { payload });
        writeOutput('Message written to channel: ' + channel?.channelAddress, response);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
};

export const readHistory = async (options: { identityFile: string, presharedKey: string, publicChannel: boolean, outputFile: string, channelFile: string }) => {
    try {
        const { identityFile, presharedKey, publicChannel, outputFile, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.readHistory(channel.channelAddress, presharedKey, publicChannel ? ChannelType.public : ChannelType.private);
        writeOutput('History: ', response, outputFile);
    } catch (e: any) {
        console.log(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.log(chalk.bold.red(e.response.data.error));
    }
}

export const readChannel = async (
    options: {
        identityFile: string,
        limit: string,
        index: string,
        asc: string,
        startDate: string,
        endDate: string,
        outputFile: string,
        channelFile: string
    }
) => {
    try {
        const { identityFile, limit, index, asc, startDate, endDate, outputFile, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.read(channel.channelAddress, {
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

export const reimportChannel = async (options: { identityFile: string, password?: string, channelFile: string }) => {
    try {
        const { identityFile, password, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        checkProperty(channel?.seed, "seed");
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.reimport(channel.channelAddress, { seed: channel.seed, subscriptionPassword: password });
        writeOutput('Reimport:', response);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const validateLogs = async (options: { identityFile: string, dataFile: string, channelFile: string }) => {
    try {
        const { dataFile, identityFile, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const data: ValidateBody = parseInput(dataFile);
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.validate(channel.channelAddress, data);
        writeOutput('Validation result:', response);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const subscribe = async (options: { identityFile: string, rights: string, seed: string, presharedKey: string, channelFile: string }) => {
    try {
        const { identityFile, channelFile, rights, presharedKey, seed } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        let accessRights: AccessRights | undefined = undefined ;
        if(Object.values(AccessRights).includes(rights as AccessRights)){
            accessRights = rights as AccessRights;
        }
        const api = await getAuthenticatedApi(identityFile);
        const subscription = await api.requestSubscription(channel.channelAddress, {seed, accessRights, presharedKey});
        writeOutput('Subscription', subscription);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const authorize = async (id: string, options: { identityFile: string, channelFile: string}) => {
    try {
        const { identityFile, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const api = await getAuthenticatedApi(identityFile);
        const subscription = await api.findSubscription(channel.channelAddress, id);
        if (!subscription) {
            console.error(chalk.bold.green('Subscription not found'))
            return;
        }
        console.error(chalk.bold.green('Subscription found: authorizing...'));
        const response = await api.authorizeSubscription(channel.channelAddress, {
            subscriptionLink: subscription.subscriptionLink,
            id: subscription.id
        })
        writeOutput('Identity ' + id + " authorized", response);
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const addSubscription = async (options: { subscriberId: string, identityFile: string, subscriptionFile: string, channelFile: string }) => {
    try {
        const { identityFile, subscriberId, subscriptionFile, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const subscription: Subscription = parseInput(subscriptionFile);
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.addSubscription(channel.channelAddress, subscriberId, subscription);
        writeOutput(`Added subscription`, response)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const updateSubscription = async (options: { subscriberId: string, identityFile: string, subscriptionFile: string, channelFile: string }) => {
    try {
        const { identityFile, subscriberId, subscriptionFile, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const subscriptionUpdate: SubscriptionUpdate = parseInput(subscriptionFile);
        const api = await getAuthenticatedApi(identityFile);
        await api?.updateSubscription(channel.channelAddress, subscriberId, subscriptionUpdate);
        writeOutput(`Updated subscription`)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const removeSubscription = async (options: { subscriberId: string, identityFile: string, channelFile: string }) => {
    try {
        const { identityFile, subscriberId, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const api = await getAuthenticatedApi(identityFile);
        await api?.removeSubscription(channel.channelAddress, subscriberId);
        writeOutput(`Removed subscription`)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const revokeSubscription = async (options: { identityFile: string, subscriptionLink: string, subscriberId: string, channelFile: string }) => {
    try {
        const { identityFile, subscriptionLink, subscriberId, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const api = await getAuthenticatedApi(identityFile);
        await api?.revokeSubscription(channel.channelAddress, { subscriptionLink, id: subscriberId });
        writeOutput(`Revoked subscription`)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const findSubscription = async (options: { subscriberId: string, identityFile: string, outputFile: string, channelFile: string }) => {
    try {
        const { identityFile, subscriberId, outputFile, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.findSubscription(channel.channelAddress, subscriberId);
        writeOutput(`Found subscription: `, response, outputFile)
    } catch (e: any) {
        console.error(chalk.bold.red(e.message));
        if (e?.response?.data?.error) console.error(chalk.bold.red(e.response.data.error));
    }
}

export const findAllSubscriptions = async (options: { identityFile: string, isAuthorized?: boolean, outputFile: string, channelFile: string }) => {
    try {
        const { identityFile, isAuthorized, outputFile, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.findAllSubscriptions(channel.channelAddress, isAuthorized);
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

export const getChannelInfo = async (options: { identityFile: string, outputFile: string, channelFile: string }) => {
    try {
        const { identityFile, outputFile, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const api = await getAuthenticatedApi(identityFile);
        const response = await api?.info(channel.channelAddress);
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

export const removeChannelInfo = async (options: { identityFile: string, channelFile: string }) => {
    try {
        const { identityFile, channelFile } = options;
        const channel = parseInput(channelFile);
        checkProperty(channel?.channelAddress, "channelAddress");
        const api = await getAuthenticatedApi(identityFile);
        await api?.remove(channel.channelAddress);
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
