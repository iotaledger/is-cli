import { ClientConfig } from 'iota-is-client';
import { Manager } from 'iota-is-client';
import { ApiVersion } from 'iota-is-client';
import { Identity, User, IdentityInternal, TrustedRootBody } from 'iota-is-client';
const configurations = require('home-config').load('config.ini');
const fs = require('fs')
const yaml = require('yaml')


exports.create = async (createFile: any) => {
  let api = getApi();
  const file = fs.readFileSync(createFile.create, 'utf8')
  const doc = yaml.parseDocument(file);
  const ob = JSON.parse(JSON.stringify(doc))

  const identity = await api?.create("Device", ob.claim);

  console.log('identity', identity)
}

exports.search = async (username: any) => {
  let api = await getAuthenticatedApi();
  let users = await api?.search(username.username);
  console.log(users);
}

exports.find = async (identityId: any) => {
  let api = await getAuthenticatedApi();
  let did = await api?.find(identityId.did);
  console.log(did)
}

exports.remove = async (identityId: any) => {
  let api = await getAuthenticatedApi();
  let did = await api?.remove(identityId.did)
  console.log('Removed: ', identityId.did)

}

exports.update = async (identity: any) => {
  let api = await getAuthenticatedApi();
  const file = fs.readFileSync(identity.put, 'utf8')
  const doc = yaml.parseDocument(file);
  const ob = JSON.parse(JSON.stringify(doc))
  let update = await api?.update(ob);
  console.log(update)
}

exports.latestDocument = async (identityId: string) => {
  let api = await getAuthenticatedApi();
  let latestDocument = await api?.latestDocument(identityId);
  console.log(latestDocument);
}

exports.getTrustedAuthorities = async () => {
  try {
    let api = await getAuthenticatedApi();
    let res = await api?.getTrustedAuthorities();
    console.log(res)
  } catch (e) {
    console.log(e)
  }
}

exports.createCredential = async (credentialVC: any) => {
  let api = await getAuthenticatedApi();
  const file = fs.readFileSync(credentialVC, 'utf8')
  const doc = yaml.parseDocument(file);
  const ob = JSON.parse(JSON.stringify(doc))
  let res = await api?.createCredential(ob.initiatorVC, ob.initiatorVC.id, ob.claim)
  console.log(res)
  
}

exports.add = async (identity: string) => {
  let api = await getAuthenticatedApi();
  //let manager = await getManager();
  //let rootId = await manager?.getRootIdentity();
  //manager?.close();
  //let rootIdentity = (await api?.find(rootId?.doc?.id)) as IdentityInternal;
  //const verifiableCredentials = rootIdentity!.verifiableCredentials;
  //let rootCredential = verifiableCredentials ? verifiableCredentials[0] : null;
  //let vc = await api?.createCredential(rootCredential!, identity, { sensor : 'Pressure'});
  //let ver = await api?.checkCredential(vc!);
  let res = (await api?.find(identity)) as IdentityInternal;
  res.identityId = 'did:iota:Hd7TTaswZiGJ5V8HUkMYHB7JB4Q2FHET37ywtYLFqwwK'
  let result = await api!.add(res)
  console.log(result, 'added')

  //console.log(result)

  //let result = await api?.add(res!);
  //console.log(result)

}





const getAuthenticatedApi = async () => {
  let api = getApi();
  let manager = getManager();
  let rootId = await manager?.getRootIdentity();
  await api?.authenticate(rootId);
  await manager?.close();
  return api;
}



const getManager = () => {
  try {
    let manager: Manager = new Manager(
      configurations.url,
      configurations.name,
      configurations.secret
    );
    return manager
  } catch (e: any) {
    console.log(e)
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

  } catch (e: any) {
    console.log(e);
  }
}


