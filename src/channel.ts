import { Channel, ClientConfig } from 'iota-is-client';
import { ApiVersion } from 'iota-is-client';
const homeConfig = require('home-config');
const fs = require('fs');
const yaml = require('yaml');


exports.createChannel = async (options: { config: string, identity: string, createChannelBody: string }) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const data = fs.readFileSync(options.createChannelBody, 'utf8');
        const response = await api?.create(JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
}

exports.write = async (address: string, options: { config: string, identity: string, addChannelLogBody: string }) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const data = fs.readFileSync(options.addChannelLogBody, 'utf8');
        const response = await api?.write(address, JSON.parse(data));
        console.log(response)
    } catch (ex: any) {
        console.log(ex);
    }
}

exports.read = async (address: string, options: {
    config: string, identity: string, limit: string,
    index: string, asc: string, startDate: string, endDate: string
}) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const response = await api?.read(address,
            options.limit ? Number(options.limit) : undefined,
            options.index ? Number(options.index) : undefined,
            options.asc ? Boolean(options.asc) : undefined,
            options.startDate ? new Date(options.startDate) : undefined,
            options.endDate ? new Date(options.endDate) : undefined
        );
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.readHistory = async (address: string, presharedKey: string, options: { config: string, identity: string }) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const response = api?.readHistory(address, presharedKey);
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
}

exports.validate = async (address: string, options: { config: string, identity: string, validateBody: string }) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const data = fs.readFileSync(options.validateBody, 'utf8');
        const response = api?.validate(address, JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
}

exports.reimport = async (address: string, options: { config: string, identity: string, reimportBody: string }) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const data = fs.readFileSync(options.reimportBody, 'utf8');
        await api?.reimport(address, JSON.parse(data));
        console.log('Reimported data for ' + address);
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.search = async (options: {
    config: string, identity: string,
    author?: string, topicType?: string, topicSource?: string,
    created?: Date, latestMessage?: Date, limit?: number, index?: number
}) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const response = await api?.search(
            options?.author,
            options?.topicType,
            options?.topicSource,
            options?.created ? new Date(options.created) : undefined,
            options?.latestMessage ? new Date(options.latestMessage) : undefined,
            options?.limit ? Number(options.limit) : undefined,
            options?.index ? Number(options.index) : undefined
        );
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.info = async (address: string, options: { config: string, identity: string}) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const response = await api?.info(address);
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.addChannelInfo = async (options: { config: string, identity: string, channelInfo: string}) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const data = fs.readFileSync(options.channelInfo, 'utf8');
        await api?.add(JSON.parse(data))
        console.log("Added channel info");
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.updateChannelInfo = async (options: { config: string, identity: string, channelInfo: string}) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        const data = fs.readFileSync(options.channelInfo, 'utf8');
        await api?.update(JSON.parse(data))
        console.log("Updated channel info");
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.remove = async (address: string, options: { config: string, identity: string}) => {
    try {
        const api = await getAuthenticatedApi(options.config, options.identity);
        await api?.remove(address);
        console.log("Updated channel info");
    } catch (ex: any) {
        console.log(ex)
    }
}


const getAuthenticatedApi = async (config: string, identitiy: string): Promise<Channel | undefined> => {
    const apiConfig = homeConfig.load(config);
    let api = getApi(apiConfig);
    const admin = fs.readFileSync(identity);
    await api?.authenticate(JSON.parse(admin));
    return api;
}

const getApi = (configurations: { apiKey: string, baseUrl: string }): Channel | undefined => {
    try {
        let config: ClientConfig = {
            apiKey: configurations.apiKey,
            baseUrl: configurations.baseUrl,
            apiVersion: ApiVersion.v1
        }

        let api = new Channel(config);
        return api;

    } catch (ex: any) {
        console.log(ex);
    }
}