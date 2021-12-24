"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const iota_is_client_1 = require("iota-is-client");
const iota_is_client_2 = require("iota-is-client");
const iota_is_client_3 = require("iota-is-client");
const configurations = require('home-config').load('config.ini');
const fs = require('fs');
const yaml = require('yaml');
exports.create = (createFile) => __awaiter(void 0, void 0, void 0, function* () {
    let api = getApi();
    const file = fs.readFileSync(createFile.create, 'utf8');
    const doc = yaml.parseDocument(file);
    const ob = JSON.parse(JSON.stringify(doc));
    const identity = yield (api === null || api === void 0 ? void 0 : api.create("Device", ob.claim));
    console.log('identity', identity);
});
exports.search = (username) => __awaiter(void 0, void 0, void 0, function* () {
    let api = yield getAuthenticatedApi();
    let users = yield (api === null || api === void 0 ? void 0 : api.search(username.username));
    console.log(users);
});
exports.find = (identityId) => __awaiter(void 0, void 0, void 0, function* () {
    let api = yield getAuthenticatedApi();
    let did = yield (api === null || api === void 0 ? void 0 : api.find(identityId.did));
    console.log(did);
});
exports.remove = (identityId) => __awaiter(void 0, void 0, void 0, function* () {
    let api = yield getAuthenticatedApi();
    let did = yield (api === null || api === void 0 ? void 0 : api.remove(identityId.did));
    console.log('Removed: ', identityId.did);
});
exports.update = (identity) => __awaiter(void 0, void 0, void 0, function* () {
    let api = yield getAuthenticatedApi();
    const file = fs.readFileSync(identity.put, 'utf8');
    const doc = yaml.parseDocument(file);
    const ob = JSON.parse(JSON.stringify(doc));
    let update = yield (api === null || api === void 0 ? void 0 : api.update(ob));
    console.log(update);
});
exports.latestDocument = (identityId) => __awaiter(void 0, void 0, void 0, function* () {
    let api = yield getAuthenticatedApi();
    let latestDocument = yield (api === null || api === void 0 ? void 0 : api.latestDocument(identityId));
    console.log(latestDocument);
});
exports.getTrustedAuthorities = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let api = yield getAuthenticatedApi();
        let res = yield (api === null || api === void 0 ? void 0 : api.getTrustedAuthorities());
        console.log(res);
    }
    catch (e) {
        console.log(e);
    }
});
exports.createCredential = (credentialVC) => __awaiter(void 0, void 0, void 0, function* () {
    let api = yield getAuthenticatedApi();
    const file = fs.readFileSync(credentialVC, 'utf8');
    const doc = yaml.parseDocument(file);
    const ob = JSON.parse(JSON.stringify(doc));
    let res = api === null || api === void 0 ? void 0 : api.createCredential(ob.initiatorVC, ob.initiatorVC.id, ob.claim);
    console.log(res);
});
exports.add = (identity) => __awaiter(void 0, void 0, void 0, function* () {
    let api = yield getAuthenticatedApi();
    //let manager = await getManager();
    //let rootId = await manager?.getRootIdentity();
    //manager?.close();
    //let rootIdentity = (await api?.find(rootId?.doc?.id)) as IdentityInternal;
    //const verifiableCredentials = rootIdentity!.verifiableCredentials;
    //let rootCredential = verifiableCredentials ? verifiableCredentials[0] : null;
    //let vc = await api?.createCredential(rootCredential!, identity, { sensor : 'Pressure'});
    //let ver = await api?.checkCredential(vc!);
    let res = (yield (api === null || api === void 0 ? void 0 : api.find(identity)));
    res.identityId = 'did:iota:Hd7TTaswZiGJ5V8HUkMYHB7JB4Q2FHET37ywtYLFqwwK';
    let result = yield api.add(res);
    console.log(result, 'added');
    //console.log(result)
    //let result = await api?.add(res!);
    //console.log(result)
});
const getAuthenticatedApi = () => __awaiter(void 0, void 0, void 0, function* () {
    let api = getApi();
    let manager = getManager();
    let rootId = yield (manager === null || manager === void 0 ? void 0 : manager.getRootIdentity());
    yield (api === null || api === void 0 ? void 0 : api.authenticate(rootId));
    yield (manager === null || manager === void 0 ? void 0 : manager.close());
    return api;
});
const getManager = () => {
    try {
        let manager = new iota_is_client_1.Manager(configurations.url, configurations.name, configurations.secret);
        return manager;
    }
    catch (e) {
        console.log(e);
    }
};
const getApi = () => {
    try {
        let config = {
            apiKey: configurations.apiKey,
            baseUrl: configurations.baseUrl,
            apiVersion: iota_is_client_2.ApiVersion.v1
        };
        let api = new iota_is_client_3.Identity(config);
        return api;
    }
    catch (e) {
        console.log(e);
    }
};
