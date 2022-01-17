import { ClientConfig, Subscription } from 'iota-is-client';
import { ApiVersion } from 'iota-is-client';
const homeConfig = require('home-config');
const fs = require('fs');
const yaml = require('yaml');


exports.findAll = async (channelAddress: string, options: { config: string, identity: string, isAuthorized: boolean }) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const response = await api?.findAll(channelAddress, options?.isAuthorized);
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
}

exports.findById = async (channelAddress: string, identityId: string, options: { config: string, identity: string }) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const response = await api?.find(channelAddress, identityId);
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
}

exports.request = async (channelAddress: string, options:{ config: string, identity: string, requestSubscriptionBody: string }) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const data = fs.readFileSync(options.requestSubscriptionBody, 'utf8');
        const response = await api?.request(channelAddress, JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }

}

exports.authorize = async (channelAddress: string, options:{ config: string, identity: string, authorizeSubscriptionBody: string }) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const data = fs.readFileSync(options.authorizeSubscriptionBody, 'utf8');
        const response = await api?.authorize(channelAddress, JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.revoke = async (channelAddress: string, options:{ config: string, identity: string, revokeSubscriptionBody: string }) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const data = fs.readFileSync(options.revokeSubscriptionBody, 'utf8');
        const response = await api?.revoke(channelAddress, JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.add = async (channelAddress: string, identityId: string, options:{ config: string, identity: string, subscription: string }) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const data = fs.readFileSync(options.subscription, 'utf8');
        const response = await api?.add(channelAddress, identityId, JSON.parse(data))
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.update = async (channelAddress: string, identityId: string, options:{ config: string, identity: string, subscriptionUpdate: string }) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const data = fs.readFileSync(options.subscriptionUpdate, 'utf8');
        const response = await api?.update(channelAddress, identityId, JSON.parse(data))
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.remove = async (channelAddress: string, identityId: string, options:{ config: string, identity: string}) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const response = await api?.remove(channelAddress, identityId)
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}


const getAuthenticatedApi = async (config: string, identity: string): Promise<Subscription | undefined> => {
    const apiConfig = homeConfig.load(config);
    let api = getApi(apiConfig);
    const admin = fs.readFileSync(identity);
    await api?.authenticate(JSON.parse(admin));
    return api;
}

const getApi = (configurations: { apiKey: string, baseUrl: string }): Subscription | undefined => {
    try {
        let config: ClientConfig = {
            apiKey: configurations.apiKey,
            baseUrl: configurations.baseUrl,
            apiVersion: ApiVersion.v1
        }

        let api = new Subscription(config);
        return api;

    } catch (ex: any) {
        console.log(ex);
    }
}