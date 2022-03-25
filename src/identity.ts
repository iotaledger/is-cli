import { IdentityClient, ApiVersion, ClientConfig } from '@iota/is-client';
import chalk from 'chalk';
import fs from 'fs';
import nconf from 'nconf';
import os from 'os';
import path from 'path';

export const createIdentity = async (identityFilePath: string) => {
  try {
    const api = getApi();
    const file = fs.readFileSync(identityFilePath, 'utf8');
    const data = JSON.parse(file);
    const response = await api.create(
      data.username, 
      data.claimType,
      data.claim
    );
    console.log(chalk.bold.green('Identity create: '))
    console.log(response);

  } catch (ex: any) {
    console.log(ex);
  }
}

export const searchIdentity = async (username: string, options: { identity: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    let response = await api?.search({ username });
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

export const findIdentity = async (identityId: any, options: { identity: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    let response = await api?.find(identityId);
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

export const addIdentity = async (options: {config: string, identity: string, identitiyData: string}) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    const file = fs.readFileSync(options.identitiyData, 'utf8');
    await api?.add(JSON.parse(file));
    console.log("added identity into bridge");
  } catch (ex: any) {
    console.log(ex);
  }
}

export const removeIdentity = async (identityId: string, options: { identity: string, revoke?: boolean, config: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    options.revoke ? await api?.remove(identityId, true) : await api?.remove(identityId);
    console.log('Removed: ', identityId);
  } catch (ex: any) {
    console.log(ex);
  }
}

export const updateIdentity = async (updateFile: string, options: { identity: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    const file = fs.readFileSync(updateFile, 'utf8');
    await api?.update(JSON.parse(file));
    console.log("Updated identity");
  } catch (ex: any) {
    console.log(ex);
  }
}

export const latestDocument = async (identityId: string, options: { identity: string, config: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    const response = await api?.latestDocument(identityId);
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

export const getTrustedAuthorities = async (options: { identity: string, config: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    const response = await api?.getTrustedAuthorities();
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

export const addTrustedAuthority = async (authority: string, options: { identity: string, config: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    await api?.addTrustedAuthority(authority);
    console.log('Added ' + authority);
  } catch (ex: any) {
    console.log(ex);
  }
}

export const removeTrustedAuthority = async(authorityId: string, options: {identity: string, config: string}) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    await api?.removeTrustedAuthority(authorityId);
    console.log('Deleted ' + authorityId);
  } catch (ex: any) {
    console.log(ex);
  }
}

export const createCredential = async (vcFile: string, options: {identity: string, config: string}) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    const file = fs.readFileSync(vcFile, 'utf8');
    const data = JSON.parse(file);
    console.log(data);
    console.log(data.initiatorVC);
    const response = await api?.createCredential(
      data.initiatorVC, 
      data.targetDid, 
      data.credentialType,
      data.claimType,
      data.claim
    );
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

export const checkCredential = async (vcFile: string, options: {identity: string, config: string}) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    const file = fs.readFileSync(vcFile, 'utf-8');
    let response = await api?.checkCredential(JSON.parse(file));
    console.log(response)
  } catch (ex: any) {
    console.log(ex)
  }
}

export const revokeCredential = async (signatureValue: string, options: {identity: string, config: string}) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    await api?.revokeCredential({signatureValue: signatureValue});
    console.log("Revoked credential for " + signatureValue)
  } catch (ex) {
    console.log(ex)
  }
}

const getAuthenticatedApi = async (identity: string): Promise<IdentityClient> => {
  let api = getApi();
  const admin = JSON.parse(fs.readFileSync(identity, {encoding:'utf8', flag:'r'}));
  await api.authenticate(admin.doc.id, admin.key.secret);
  return api;
}

const getApi = (): IdentityClient => {
  nconf.file({ 
    file: path.join(os.homedir(), '.iota-is.json')
  });

  const isGatewayUrl = nconf.get("isGatewayUrl");
  const ssiBridgeUrl = nconf.get("ssiBridgeUrl");
  const auditTrailUrl = nconf.get("auditTrailUrl");

  if (!isGatewayUrl && !(ssiBridgeUrl || auditTrailUrl)) {
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
  return new IdentityClient(config);
}


