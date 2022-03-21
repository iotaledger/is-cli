import { ApiVersion, ChannelClient, ClientConfig } from 'iota-is-sdk';
const fs = require('fs');
const yaml = require('yaml');
const nconf = require('nconf');
const os = require('os');
const path = require('path');

exports.createChannel = async (options: { identity: string, apply: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.apply, 'utf8');
        const response = await api?.create(JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
}

exports.write = async (address: string, options: { identity: string, addChannelLogBody: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.addChannelLogBody, 'utf8');
        /*
        type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        created: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        metadata: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TAny>;
        publicPayload: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TAny>;
        payload: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TAny>;
        */
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
        const api = await getAuthenticatedApi(options.identity);
        const response = await api?.read(address,
            {
                limit: options.limit ? Number(options.limit) : undefined,
                index: options.index ? Number(options.index) : undefined,
                asc: options.asc ? Boolean(options.asc) : undefined,
                startDate: options.startDate ? new Date(options.startDate) : undefined,
                endDate: options.endDate ? new Date(options.endDate) : undefined
            }
        );
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.readHistory = async (address: string, presharedKey: string, options: { config: string, identity: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const response = api?.readHistory(address, presharedKey);
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
}

exports.validate = async (address: string, options: { config: string, identity: string, validateBody: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.validateBody, 'utf8');
        const response = api?.validate(address, JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
}

exports.reimport = async (address: string, options: { config: string, identity: string, reimportBody: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
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
        const api = await getAuthenticatedApi(options.identity);
        const response = await api?.search(
            {
                author: options?.author,
                topicType: options?.topicType,
                topicSource: options?.topicSource,
                created: options?.created ? new Date(options.created) : undefined,
                latestMessage: options?.latestMessage ? new Date(options.latestMessage) : undefined,
                limit: options?.limit ? Number(options.limit) : undefined,
                index: options?.index ? Number(options.index) : undefined
            }
        );
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.info = async (address: string, options: { config: string, identity: string}) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const response = await api?.info(address);
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.addChannelInfo = async (options: { config: string, identity: string, channelInfo: string}) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.channelInfo, 'utf8');
        await api?.add(JSON.parse(data))
        console.log("Added channel info");
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.updateChannelInfo = async (options: { config: string, identity: string, channelInfo: string}) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.channelInfo, 'utf8');
        await api?.update(JSON.parse(data))
        console.log("Updated channel info");
    } catch (ex: any) {
        console.log(ex)
    }
}

exports.remove = async (address: string, options: { config: string, identity: string}) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        await api?.remove(address);
        console.log("Updated channel info");
    } catch (ex: any) {
        console.log(ex)
    }
}


const getAuthenticatedApi = async (identity: string): Promise<ChannelClient> => {
    let api = getApi();
    const admin = JSON.parse(fs.readFileSync(identity));
    await api.authenticate(admin.doc.id, admin.key.secret);
    return api;
}

const getApi = (): ChannelClient => {
    
    nconf.file({ 
        file: path.join(os.homedir(), '.iota-is.json')
    });

    const baseUrl = nconf.get("baseUrl");
    if (!baseUrl) {
      throw Error("baseUrl is missing: run config command first");
    }
  
    const apiKey = nconf.get("apiKey");
    if (!apiKey) {
      throw Error("apiKey is missing: run config command first");
    }
  
    let config: ClientConfig = {
        apiKey: apiKey,
        baseUrl: baseUrl,
        apiVersion: ApiVersion.v01
    }

    return new ChannelClient(config);
}