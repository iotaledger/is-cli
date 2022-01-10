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
    try {
        let api = getApi();
        const file = fs.readFileSync(createFile.apply, 'utf8');
        const doc = yaml.parseDocument(file);
        const didObj = JSON.parse(JSON.stringify(doc));
        const identity = yield (api === null || api === void 0 ? void 0 : api.create("Device", didObj.claim));
        console.log('identity', identity);
    }
    catch (ex) {
        console.log(ex);
    }
});
exports.search = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let api = yield getAuthenticatedApi();
        let users = yield (api === null || api === void 0 ? void 0 : api.search(username));
        console.log(users);
    }
    catch (ex) {
        console.log(ex);
    }
});
exports.find = (identityId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let api = yield getAuthenticatedApi();
        let did = yield (api === null || api === void 0 ? void 0 : api.find(identityId));
        console.log(did);
    }
    catch (ex) {
        console.log(ex);
    }
});
exports.remove = (identityId, revoke) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let api = yield getAuthenticatedApi();
        revoke ? yield (api === null || api === void 0 ? void 0 : api.remove(identityId, true)) : yield (api === null || api === void 0 ? void 0 : api.remove(identityId));
        console.log('Removed: ', identityId);
    }
    catch (ex) {
        console.log(ex);
    }
});
exports.update = (updateFile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let api = yield getAuthenticatedApi();
        const file = fs.readFileSync(updateFile, 'utf8');
        const doc = yaml.parseDocument(file);
        const did = JSON.parse(JSON.stringify(doc));
        let update = yield (api === null || api === void 0 ? void 0 : api.update(did));
        console.log(update);
    }
    catch (ex) {
        console.log(ex);
    }
});
exports.latestDocument = (identityId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let api = yield getAuthenticatedApi();
        let latestDocument = yield (api === null || api === void 0 ? void 0 : api.latestDocument(identityId));
        console.log(latestDocument);
    }
    catch (ex) {
        console.log(ex);
    }
});
exports.getTrustedAuthorities = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let api = yield getAuthenticatedApi();
        let trustedAuthority = yield (api === null || api === void 0 ? void 0 : api.getTrustedAuthorities());
        console.log(trustedAuthority);
    }
    catch (ex) {
        console.log(ex);
    }
});
exports.createCredential = (credentialVC) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let api = yield getAuthenticatedApi();
        const file = fs.readFileSync(credentialVC, 'utf8');
        const doc = yaml.parseDocument(file);
        const ob = JSON.parse(JSON.stringify(doc));
        let res = yield (api === null || api === void 0 ? void 0 : api.createCredential(ob.initiatorVC, ob.initiatorVC.id, ob.claim));
        console.log(res);
    }
    catch (ex) {
        console.log(ex);
    }
});
exports.checkCredential = (credentialVC) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let api = yield getAuthenticatedApi();
        const file = fs.readFileSync(credentialVC, 'utf-8');
        const doc = yaml.parseDocument(file);
        const ob = JSON.parse(JSON.stringify(doc));
        console.log(ob);
        let res = yield (api === null || api === void 0 ? void 0 : api.checkCredential(ob));
        console.log(res);
    }
    catch (ex) {
        console.log(ex);
    }
});
exports.revokeCredential = (signatureValue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let api = yield getAuthenticatedApi();
        const body = { signatureValue: signatureValue };
        let res = yield (api === null || api === void 0 ? void 0 : api.revokeCredential(body));
        console.log(res);
    }
    catch (ex) {
        console.log(ex);
    }
});
const getAuthenticatedApi = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let api = getApi();
        let manager = getManager();
        let rootId = yield (manager === null || manager === void 0 ? void 0 : manager.getRootIdentity());
        yield (api === null || api === void 0 ? void 0 : api.authenticate(rootId));
        yield (manager === null || manager === void 0 ? void 0 : manager.close());
        return api;
    }
    catch (ex) {
        console.log(ex);
    }
});
const getManager = () => {
    try {
        let manager = new iota_is_client_1.Manager(configurations.url, configurations.name, configurations.secret);
        return manager;
    }
    catch (ex) {
        console.log(ex);
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
    catch (ex) {
        console.log(ex);
    }
};
