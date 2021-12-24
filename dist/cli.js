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
    let api = getApi();
    let manager = getManager();
    let rootId = yield (manager === null || manager === void 0 ? void 0 : manager.getRootIdentity());
    yield (api === null || api === void 0 ? void 0 : api.authenticate(rootId));
    yield (manager === null || manager === void 0 ? void 0 : manager.close());
    let users = yield (api === null || api === void 0 ? void 0 : api.search(username.username));
    console.log(users);
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
