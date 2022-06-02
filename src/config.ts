import chalk from 'chalk';
import nconf from 'nconf';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { ApiVersion } from '@iota/is-client';

export const configure = async (options: {
    isGatewayUrl?: string;
    ssiBridgeUrl?: string;
    auditTrailUrl?: string;
    apiKey?: string;
    apiVersion?: ApiVersion
}) => {
    try {
        let { isGatewayUrl, ssiBridgeUrl, auditTrailUrl, apiKey, apiVersion } = options;
        if (apiVersion === undefined) apiVersion = ApiVersion.v01
        console.log(options);
        checkConfig(isGatewayUrl, ssiBridgeUrl, auditTrailUrl);

        // Delete the old config when a new one is created
        if (fs.existsSync(path.join(os.homedir(), '.iota-is.json'))) {
            fs.unlinkSync(path.join(os.homedir(), '.iota-is.json'));
        }

        nconf
            .argv()
            .env()
            .file({
                file: path.join(os.homedir(), '.iota-is.json')
            });
        nconf.set('isGatewayUrl', isGatewayUrl);
        nconf.set('ssiBridgeUrl', ssiBridgeUrl);
        nconf.set('auditTrailUrl', auditTrailUrl);
        nconf.set('apiKey', apiKey);

        await nconf.save((err: any) => {
            if (!err) {
                console.log(chalk.bold.green('Configuration has been set'));
            } else {
                console.log(err);
            }
        });
    } catch (e: any) {
        console.log(chalk.bold.red(e.message));
    }
};

const checkConfig = (isGatewayUrl?: string, ssiBridgeUrl?: string, auditTrailUrl?: string) => {
    if (isGatewayUrl && (ssiBridgeUrl || auditTrailUrl)) {
        throw new Error('Please only set isGatewayUrl or both ssiBridgeUrl and auditTrailUrl.');
    }
    if (isGatewayUrl === undefined && ssiBridgeUrl === undefined && auditTrailUrl === undefined) {
        throw new Error('Please set at least isGatewayUrl or both ssiBridgeUrl and auditTrailUrl.');
    }
    if ((ssiBridgeUrl && auditTrailUrl === undefined) || (auditTrailUrl && ssiBridgeUrl === undefined)) {
        throw new Error('Please set both ssiBridgeUrl and auditTrailUrl.');
    }
};
