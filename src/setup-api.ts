import chalk from 'chalk';
import { argv } from 'nconf';
import path from 'path';
import randomWord from 'random-words';
import crypto from 'crypto';
import fs from 'fs';

export const setupApi = (type: string) => {
    const API_FOLDER = 'api';
    const SSI_BRIDGE_FOLDER = 'ssi-bridge';
    const AUDIT_TRAIL_FOLDER = 'audit-trail-gw';

    const foldersExist =
        fs.existsSync(`${process.cwd()}/${API_FOLDER}/${AUDIT_TRAIL_FOLDER}`) &&
        fs.existsSync(`${process.cwd()}/${API_FOLDER}/${SSI_BRIDGE_FOLDER}`);
    if (!fs.existsSync(`${process.cwd()}/${API_FOLDER}`)) {
        return console.log(chalk.bold.red('Please navigate to the integration services source folder'));
    }
    if (!foldersExist) {
        return console.log(
            chalk.bold.red(`Was not able to detect ${SSI_BRIDGE_FOLDER} and ${AUDIT_TRAIL_FOLDER} folder`)
        );
    }
    const dbUser = `${randomWord()}-${Math.floor(Math.random() * 100000)}`;
    const dbPassword = crypto.randomBytes(32).toString('hex');
    const dbUrl = type == 'node' ? '0.0.0.0' : 'mongo';
    const server_secret = crypto.randomBytes(24).toString('base64');
    const jwt_secret = crypto.randomBytes(24).toString('base64');
    const apiKey = crypto.randomUUID();

    fs.writeFileSync(`${process.cwd()}/mongo-init.js`, generateDbConfig(dbUser, dbPassword));
    fs.writeFileSync(
        `${process.cwd()}/.env`,
        generateEnv(dbUser, dbPassword, dbUrl, server_secret, jwt_secret, apiKey, '3000')
    );
    fs.writeFileSync(
        `${process.cwd()}/${API_FOLDER}/${AUDIT_TRAIL_FOLDER}/.env`,
        generateEnv(dbUser, dbPassword, dbUrl, server_secret, jwt_secret, apiKey, '3002')
    );
    fs.writeFileSync(
        `${process.cwd()}/${API_FOLDER}/${SSI_BRIDGE_FOLDER}/.env`,
        generateEnv(dbUser, dbPassword, dbUrl, server_secret, jwt_secret, apiKey, '3001')
    );
    console.log(chalk.bold.green('Config has been setup'));
};

const generateDbConfig = (dbUser: string, dbPassword: string): string => {
    return `db.createUser(
        {
            user: "${dbUser}",
            pwd: "${dbPassword}",
            roles: [
                {
                    role: "readWrite",
                    db: "integration-services"
                }
            ]
        }
    );`;
};

const generateEnv = (
    dbUser: string,
    dbPassword: string,
    dbUrl: string,
    serverSecret: string,
    jwtSecret: string,
    apiKey: string,
    port: string
): string => {
    return `PORT=${port}
IOTA_PERMA_NODE=https://chrysalis-chronicle.iota.org/api/mainnet/
IOTA_HORNET_NODE=https://chrysalis-nodes.iota.org:443

DATABASE_NAME=integration-services
MONGO_INITDB_ROOT_USERNAME=${dbUser}
MONGO_INITDB_ROOT_PASSWORD=${dbPassword}
DATABASE_URL=mongodb://${dbUser}:${dbPassword}@${dbUrl}:27017

SERVER_SECRET=${serverSecret}
JWT_SECRET=${jwtSecret}

API_KEY=${apiKey}
        `;
};
