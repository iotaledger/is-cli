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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var iota_is_client_1 = require("iota-is-client");
var iota_is_client_2 = require("iota-is-client");
var iota_is_client_3 = require("iota-is-client");
var cfg = require('home-config').load('config.ini');
function bootstrap() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var manager, rootId, config, api, rootIdentity, verifiableCredentials, identityCredential, verified, userIdentity, vc, verified2, e_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 9, , 10]);
                    manager = new iota_is_client_1.Manager(cfg.url, cfg.name, cfg.secret);
                    return [4 /*yield*/, manager.getRootIdentity()];
                case 1:
                    rootId = _c.sent();
                    return [4 /*yield*/, manager.close()];
                case 2:
                    _c.sent();
                    console.log('Root Identity', rootId);
                    config = {
                        apiKey: '6c57f6ee-14f4-40ba-90a3-5858a1155133',
                        baseUrl: 'http://127.0.0.1:3000',
                        apiVersion: iota_is_client_2.ApiVersion.v1
                    };
                    api = new iota_is_client_3.Identity(config);
                    // Became root identity
                    return [4 /*yield*/, api.authenticate(rootId)];
                case 3:
                    // Became root identity
                    _c.sent();
                    console.log(api.jwtToken);
                    return [4 /*yield*/, api.find((_a = rootId === null || rootId === void 0 ? void 0 : rootId.doc) === null || _a === void 0 ? void 0 : _a.id)];
                case 4:
                    rootIdentity = (_c.sent());
                    verifiableCredentials = rootIdentity.verifiableCredentials;
                    identityCredential = verifiableCredentials ? verifiableCredentials[0] : null;
                    if (!identityCredential) {
                        throw new Error('root identity has no credential');
                    }
                    console.log('Root Identity Credentials', identityCredential);
                    return [4 /*yield*/, api.checkCredential(identityCredential)];
                case 5:
                    verified = _c.sent();
                    console.log('Verification result', verified);
                    return [4 /*yield*/, api.create('tester user', {
                            type: 'user'
                        })];
                case 6:
                    userIdentity = _c.sent();
                    console.log('Tester Identity', userIdentity);
                    return [4 /*yield*/, api.createCredential(identityCredential, (_b = userIdentity === null || userIdentity === void 0 ? void 0 : userIdentity.doc) === null || _b === void 0 ? void 0 : _b.id, {
                            profession: 'Professor'
                        })];
                case 7:
                    vc = _c.sent();
                    console.log("Credential created", vc);
                    console.log('Tester Verifiable Credential');
                    return [4 /*yield*/, api.checkCredential(identityCredential)];
                case 8:
                    verified2 = _c.sent();
                    console.log('Verification result', verified2);
                    return [3 /*break*/, 10];
                case 9:
                    e_1 = _c.sent();
                    console.log(e_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
var configuration = function () {
    console.log(cfg.getAll());
};
bootstrap();
configuration();
