import chalk from 'chalk';
import nconf from 'nconf';
import os from 'os';
import path from 'path';

export const configure = async (options: {
    isGatewayUrl?: string;
    ssiBridgeUrl?: string;
    auditTrailUrl?: string;
    apiKey: string;
}) => {
    try {
        nconf.argv().env().file({
            file: path.join(os.homedir(), '.iota-is.json')
        });
        options.isGatewayUrl && nconf.set('isGatewayUrl', options.isGatewayUrl);
        options.ssiBridgeUrl && nconf.set('ssiBridgeUrl', options.ssiBridgeUrl);
        options.auditTrailUrl && nconf.set('auditTrailUrl', options.auditTrailUrl);
        nconf.set('apiKey', options.apiKey);

        await nconf.save((err: any) => {
            if (!err) {
                console.log(chalk.bold.green('Configuration has been set'));
            }
            else {
                console.log(err)
            }
        });
    } catch (ex: any) {
        console.log(ex);
    }
};
