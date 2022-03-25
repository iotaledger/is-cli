import { ApiVersion, ChannelClient, ClientConfig } from '@iota/is-client';
import fs from 'fs';
import nconf from 'nconf';
import os from 'os';
import path from 'path';

export const createChannel = async (options: { identity: string, apply: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.apply, 'utf8');
        const response = await api?.create(JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
}

export const write = async (address: string, options: { identity: string, addChannelLogBody: string }) => {
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

export const read = async (address: string, options: {
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

export const readHistory = async (address: string, presharedKey: string, options: { config: string, identity: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const response = api?.readHistory(address, presharedKey);
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
}

export const validate = async (address: string, options: { config: string, identity: string, validateBody: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.validateBody, 'utf8');
        const response = api?.validate(address, JSON.parse(data));
        console.log(response);
    } catch (ex: any) {
        console.log(ex);
    }
}

export const reimport = async (address: string, options: { config: string, identity: string, reimportBody: string }) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.reimportBody, 'utf8');
        await api?.reimport(address, JSON.parse(data));
        console.log('Reimported data for ' + address);
    } catch (ex: any) {
        console.log(ex)
    }
}

export const searchChannel = async (options: {
    config: string, identity: string,
    authorId?: string, topicType?: string, topicSource?: string,
    created?: Date, latestMessage?: Date, limit?: number, index?: number
}) => {
    try {
        const { identity, authorId, topicType, topicSource, created, latestMessage, limit, index} = options;
        const api = await getAuthenticatedApi(identity);
        
        const response = await api?.search(
            {
                authorId,
                topicType,
                topicSource,
                created: created ? new Date(created) : undefined,
                latestMessage: latestMessage ? new Date(latestMessage) : undefined,
                limit: limit ? Number(limit) : undefined,
                index: index ? Number(index) : undefined
            }
        );
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}

export const info = async (address: string, options: { config: string, identity: string}) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const response = await api?.info(address);
        console.log(response);
    } catch (ex: any) {
        console.log(ex)
    }
}

export const addChannelInfo = async (options: { config: string, identity: string, channelInfo: string}) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.channelInfo, 'utf8');
        await api?.add(JSON.parse(data))
        console.log("Added channel info");
    } catch (ex: any) {
        console.log(ex)
    }
}

export const updateChannelInfo = async (options: { config: string, identity: string, channelInfo: string}) => {
    try {
        const api = await getAuthenticatedApi(options.identity);
        const data = fs.readFileSync(options.channelInfo, 'utf8');
        await api?.update(JSON.parse(data))
        console.log("Updated channel info");
    } catch (ex: any) {
        console.log(ex)
    }
}

export const removeChannel = async (address: string, options: { config: string, identity: string}) => {
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
    const admin = JSON.parse(fs.readFileSync(identity, {encoding:'utf8', flag:'r'}));
    await api.authenticate(admin.doc.id, admin.key.secret);
    return api;
}

const getApi = (): ChannelClient => {
    nconf.file({ 
      file: path.join(os.homedir(), '.iota-is.json')
    });
  
    const isGatewayUrl = nconf.get("isGatewayUrl");
    const ssiBridgeUrl = nconf.get("ssiBridgeUrl");
    const auditTrailUrl = nconf.get("auditTrailUrl");
  
    if (!isGatewayUrl || !(ssiBridgeUrl && auditTrailUrl)) {
      throw Error("isGatewayUrl or (ssiBridgeUrl AND auditTrailUrl) are missing: run config command first");
    }
  
    const apiKey = nconf.get("apiKey");
  
    let config: ClientConfig = {
      apiKey,
      isGatewayUrl,
      ssiBridgeUrl,
      auditTrailUrl,
      apiVersion: ApiVersion.v01
    }
    return new ChannelClient(config);
  }