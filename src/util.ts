import { ClientConfig } from 'iota-is-client';
import { Manager } from 'iota-is-client';
import { ApiVersion } from 'iota-is-client';
import { Identity, User, IdentityInternal, TrustedRootBody } from 'iota-is-client';
const configurations = require('home-config').load('config.ini');
const fs = require('fs');
const yaml = require('yaml');


exports.create = async (createFile: { apply: string }) => {
  try {
    let api = getApi();
    const file = fs.readFileSync(createFile.apply, 'utf8');
    const doc = yaml.parseDocument(file);
    const didObj = JSON.parse(JSON.stringify(doc));
    const identity = await api?.create("Device", didObj.claim);
    console.log('identity', identity);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.search = async (username: string) => {
  try {
    let api = await getAuthenticatedApi();
    let users = await api?.search(username);
    console.log(users);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.find = async (identityId: string) => {
  try {
    let api = await getAuthenticatedApi();
    let did = await api?.find(identityId);
    console.log(did);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.remove = async (identityId: string, revoke?: boolean) => {
  try {
    let api = await getAuthenticatedApi();
    revoke ? await api?.remove(identityId, true) : await api?.remove(identityId);
    console.log('Removed: ', identityId);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.update = async (updateFile: string) => {
  try {
    let api = await getAuthenticatedApi();
    const file = fs.readFileSync(updateFile, 'utf8');
    const doc = yaml.parseDocument(file);
    const did = JSON.parse(JSON.stringify(doc));
    let update = await api?.update(did);
    console.log(update);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.latestDocument = async (identityId: string) => {
  try {
    let api = await getAuthenticatedApi();
    let latestDocument = await api?.latestDocument(identityId);
    console.log(latestDocument);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.getTrustedAuthorities = async () => {
  try {
    let api = await getAuthenticatedApi();
    let trustedAuthority = await api?.getTrustedAuthorities();
    console.log(trustedAuthority);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.createCredential = async (credentialVC: string) => {
  try {
    let api = await getAuthenticatedApi();
    const file = fs.readFileSync(credentialVC, 'utf8');
    const doc = yaml.parseDocument(file);
    const ob = JSON.parse(JSON.stringify(doc));
    let res = await api?.createCredential(ob.initiatorVC, ob.initiatorVC.id, ob.claim);
    console.log(res);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.checkCredential = async (credentialVC: string) => {
  try {
    let api = await getAuthenticatedApi();
    const file = fs.readFileSync(credentialVC, 'utf-8');
    const doc = yaml.parseDocument(file);
    const ob = JSON.parse(JSON.stringify(doc));
    console.log(ob)
    let res = await api?.checkCredential(ob);
    console.log(res)
  } catch (ex: any) {
    console.log(ex)
  }
}

exports.revokeCredential = async (signatureValue: string) => {
  try {
    let api = await getAuthenticatedApi();
    const body = { signatureValue: signatureValue }
    let res = await api?.revokeCredential(body);
    console.log(res)
  } catch (ex) {
    console.log(ex)
  }
}



const getAuthenticatedApi = async () => {
  try {
    let api = getApi();
    let manager = getManager();
    let rootId = await manager?.getRootIdentity();
    await api?.authenticate(rootId);
    await manager?.close();
    return api;
  } catch (ex: any) {
    console.log(ex);
  }
}

const getManager = () => {
  try {
    let manager: Manager = new Manager(
      configurations.url,
      configurations.name,
      configurations.secret
    );
    return manager
  } catch (ex: any) {
    console.log(ex)
  }
}

const getApi = () => {
  try {
    let config: ClientConfig = {
      apiKey: configurations.apiKey,
      baseUrl: configurations.baseUrl,
      apiVersion: ApiVersion.v1
    }

    let api = new Identity(config);
    return api;

  } catch (ex: any) {
    console.log(ex);
  }
}


