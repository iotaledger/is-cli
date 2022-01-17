import { ClientConfig } from 'iota-is-client';
import { Manager } from 'iota-is-client';
import { ApiVersion } from 'iota-is-client';
import { Identity} from 'iota-is-client';
const homeConfig = require('home-config');
const fs = require('fs');
const yaml = require('yaml');



exports.login = async (config: string, output: string) => {
  try {
    const adminConfig = homeConfig.load(config);
    let manager = getManager(adminConfig);
    let managerDid = await manager?.getRootIdentity();
    fs.writeFileSync(output, JSON.stringify(managerDid), 'utf-8')
    await manager?.close();
    console.log(managerDid)
  } catch (ex: any) {
    console.log(ex)
  }
}

exports.create = async (options: { config: string, identity: string, data: string }) => {
  try {
    const apiConfig = homeConfig.load(options.config)
    let api = getApi(apiConfig);

    if (options.identity) {
      const admin = fs.readFileSync(options.identity);
      await api?.authenticate(JSON.parse(admin));
    }

    const file = fs.readFileSync(options.data, 'utf8');
    const data = JSON.parse(file);
    const response = await api?.create(data.username, data.claim);
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.search = async (username: string, options: { config: string, identity: string }) => {
  try {
    const api = await getAuthenticatedApi(options.config, options.identity)
    let response = await api?.search(username);
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.find = async (identityId: any, options: { config: string, identity: string }) => {
  try {
    const api = await getAuthenticatedApi(options.config, options.identity)
    let response = await api?.find(identityId);
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.add = async (options: {config: string, identity: string, identitiyData: string}) => {
  try {
    const api = await getAuthenticatedApi(options.config, options.identity)
    const file = fs.readFileSync(options.identitiyData, 'utf8');
    await api?.add(JSON.parse(file));
    console.log("added identity into bridge");
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.remove = async (identityId: string, options: { identity: string, revoke?: boolean, config: string }) => {
  try {
    const api = await getAuthenticatedApi(options.config, options.identity)
    options.revoke ? await api?.remove(identityId, true) : await api?.remove(identityId);
    console.log('Removed: ', identityId);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.update = async (updateFile: string, options: { config: string, identity: string }) => {
  try {
    const api = await getAuthenticatedApi(options.config, options.identity)
    const file = fs.readFileSync(updateFile, 'utf8');
    await api?.update(JSON.parse(file));
    console.log("Updated identity");
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.latestDocument = async (identityId: string, options: { identity: string, config: string }) => {
  try {
    const api = await getAuthenticatedApi(options.config, options.identity)
    const response = await api?.latestDocument(identityId);
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.getTrustedAuthorities = async (options: { identity: string, config: string }) => {
  try {
    const api = await getAuthenticatedApi(options.config, options.identity)
    const response = await api?.getTrustedAuthorities();
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.addTrustedAuthority = async (authority: string, options: { identity: string, config: string }) => {
  try {
    const api = await getAuthenticatedApi(options.config, options.identity)
    await api?.addTrustedAuthority({ trustedRootId: authority });
    console.log('Added ' + authority);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.removeTrustedAuthority = async(authorityId: string, options: {identity: string, config: string}) => {
  try {
    const api = await getAuthenticatedApi(options.config, options.identity)
    await api?.removeTrustedAuthority(authorityId);
    console.log('Deleted ' + authorityId);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.createCredential = async (vcFile: string, options: {identity: string, config: string}) => {
  try {
    const api = await getAuthenticatedApi(options.config, options.identity)
    const file = fs.readFileSync(vcFile, 'utf8');
    const data = JSON.parse(file);
    const response = await api?.createCredential(data.initiatorVC, data.target.id, data.claim);
    console.log(response);
  } catch (ex: any) {
    console.log(ex);
  }
}

exports.checkCredential = async (vcFile: string, options: {identity: string, config: string}) => {
  try {
    const api = await getAuthenticatedApi(options.config, options.identity)
    const file = fs.readFileSync(vcFile, 'utf-8');
    let response = await api?.checkCredential(JSON.parse(file));
    console.log(response)
  } catch (ex: any) {
    console.log(ex)
  }
}

exports.revokeCredential = async (signatureValue: string, options: {identity: string, config: string}) => {
  try {
    const api = await getAuthenticatedApi(options.config, options.identity)
    await api?.revokeCredential({signatureValue: signatureValue});
    console.log("Revoked credential for " + signatureValue)
  } catch (ex) {
    console.log(ex)
  }
}

const getManager = (configurations: any): Manager | undefined => {
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

const getAuthenticatedApi = async (config: string, identity: string): Promise<Identity | undefined> => {
  const apiConfig = homeConfig.load(config);
  let api = getApi(apiConfig);
  const admin = fs.readFileSync(identity);
  await api?.authenticate(JSON.parse(admin));
  return api;
}

const getApi = (configurations: { apiKey: string, baseUrl: string }): Identity|undefined => {
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


