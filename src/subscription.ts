import { ClientConfig, ChannelClient } from '@iota/is-client';
import { ApiVersion } from '@iota/is-client';
import os from 'os';
import path from 'path';
const homeConfig = require('home-config');
const fs = require('fs');
const yaml = require('yaml');
const nconf = require('nconf');

exports.findAll = async (
    channelAddress: string,
    options: { config: string; identity: string; isAuthorized: boolean }
) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const response = await api?.findAllSubscriptions(channelAddress, options?.isAuthorized);
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
};

exports.findById = async (
    channelAddress: string,
    identityId: string,
    options: { config: string; identity: string }
) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const response = await api?.findSubscription(channelAddress, identityId);
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
};

exports.request = async (
    channelAddress: string,
    options: { config: string; identity: string; requestSubscriptionBody: string }
) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.requestSubscriptionBody, 'utf8');
        const response = await api?.requestSubscription(channelAddress, JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
};

exports.authorize = async (
    channelAddress: string,
    options: { config: string; identity: string; authorizeSubscriptionBody: string }
) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.authorizeSubscriptionBody, 'utf8');
        const response = await api?.authorizeSubscription(channelAddress, JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
};

exports.revoke = async (
    channelAddress: string,
    options: { config: string; identity: string; revokeSubscriptionBody: string }
) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.revokeSubscriptionBody, 'utf8');
        const response = await api?.revokeSubscription(channelAddress, JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
};

exports.add = async (
    channelAddress: string,
    identityId: string,
    options: { config: string; identity: string; subscription: string }
) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.subscription, 'utf8');
        const response = await api?.addSubscription(channelAddress, identityId, JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
};

exports.update = async (
    channelAddress: string,
    identityId: string,
    options: { config: string; identity: string; subscriptionUpdate: string }
) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.subscriptionUpdate, 'utf8');
        const response = await api?.updateSubscription(channelAddress, identityId, JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
};

exports.remove = async (channelAddress: string, identityId: string, options: { config: string; identity: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const response = await api?.removeSubscription(channelAddress, identityId);
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
};

const getAuthenticatedApi = async (identity: string): Promise<ChannelClient> => {
    let api = getApi();
    const admin = JSON.parse(fs.readFileSync(identity));
    await api.authenticate(admin.doc.id, admin.key.secret);
    return api;
};

const getApi = (): ChannelClient => {
    nconf.file({
        file: path.join(os.homedir(), '.iota-is.json')
    });

    const isGatewayUrl = nconf.get('isGatewayUrl');
    const ssiBridgeUrl = nconf.get('ssiBridgeUrl');
    const auditTrailUrl = nconf.get('auditTrailUrl');

    if (!isGatewayUrl || !(ssiBridgeUrl && auditTrailUrl)) {
        throw Error('isGatewayUrl or (ssiBridgeUrl AND auditTrailUrl) are missing: run config command first');
    }

    const apiKey = nconf.get('apiKey');
    if (!apiKey) {
        throw Error('apiKey is missing: run config command first');
    }

    let config: ClientConfig = {
        apiKey,
        isGatewayUrl,
        ssiBridgeUrl,
        auditTrailUrl,
        apiVersion: ApiVersion.v01
    };
    return new ChannelClient(config);
};
