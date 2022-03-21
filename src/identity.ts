import { Identity } from 'iota-is-client/lib';
import { IdentityClient, ApiVersion, ClientConfig, Manager } from 'iota-is-sdk';
const fs = require('fs');
const yaml = require('yaml');
const nconf = require('nconf');
const os = require('os');
const path = require('path');

exports.create = async (options: { apply: string }) => {
  try {

    let api = getApi();

    const file = fs.readFileSync(options.apply, 'utf8');
    const data = JSON.parse(file);
    const response = await api.create(
      data.username, 
      data.claimType,
      data.claim
    );
    console.log(response);

  } catch (ex: any) {
    console.log(ex);
  }
}

exports.search = async (username: string, options: { identity: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    let response = await api?.search({ username });
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.find = async (identityId: any, options: { identity: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    let response = await api?.find(identityId);
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.add = async (options: {config: string, identity: string, identitiyData: string}) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    const file = fs.readFileSync(options.identitiyData, 'utf8');
    await api?.add(JSON.parse(file));
    console.log("added identity into bridge");
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.remove = async (identityId: string, options: { identity: string, revoke?: boolean, config: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    options.revoke ? await api?.remove(identityId, true) : await api?.remove(identityId);
    console.log('Removed: ', identityId);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.update = async (updateFile: string, options: { identity: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    const file = fs.readFileSync(updateFile, 'utf8');
    await api?.update(JSON.parse(file));
    console.log("Updated identity");
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.latestDocument = async (identityId: string, options: { identity: string, config: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    const response = await api?.latestDocument(identityId);
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.getTrustedAuthorities = async (options: { identity: string, config: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    const response = await api?.getTrustedAuthorities();
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.addTrustedAuthority = async (authority: string, options: { identity: string, config: string }) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    await api?.addTrustedAuthority(authority);
    console.log('Added ' + authority);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.removeTrustedAuthority = async(authorityId: string, options: {identity: string, config: string}) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    await api?.removeTrustedAuthority(authorityId);
    console.log('Deleted ' + authorityId);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.createCredential = async (vcFile: string, options: {identity: string, config: string}) => {
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

exports.checkCredential = async (vcFile: string, options: {identity: string, config: string}) => {
  try {
    const api = await getAuthenticatedApi(options.identity)
    const file = fs.readFileSync(vcFile, 'utf-8');
    let response = await api?.checkCredential(JSON.parse(file));
    console.log(response)
  } catch (ex: any) {
    console.log(ex)
  }
}

exports.revokeCredential = async (signatureValue: string, options: {identity: string, config: string}) => {
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
  const admin = JSON.parse(fs.readFileSync(identity));
  await api.authenticate(admin.doc.id, admin.key.secret);
  return api;
}

const getApi = (): IdentityClient => {
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
  return new IdentityClient(config);
}


