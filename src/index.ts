import { program } from 'commander';
import { createChannel, readChannel, writeChannel } from './channel.js';
import { configure } from './config.js';
import {
    addIdentity,
    addTrustedAuthority,
    checkCredential,
    createIdentity,
    findIdentity,
    getTrustedAuthorities,
    latestDocument,
    removeIdentity,
    removeTrustedAuthority,
    revokeCredential,
    searchIdentity,
    updateIdentity
} from './identity.js';
import { setupApi } from './setup-api.js';

program.version('0.1.0');

program
    .command('config')
    .option('-s, --ssiBridgeUrl <SSI Bridge URL>')
    .option('-a, --auditTrailUrl <Audit Trail URL>')
    .option('-g, --isGatewayUrl <Gateway URL>')
    .option('-k, --apiKey <api Key>')
    .option('-v, --apiVersion <api version>')
    .description('Configure CLI with the API endpoints')
    .action(configure);

//create did
program
    .command('create-identity')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Create a new DID with a .json file')
    .action(createIdentity);

// search dids by username
program
    .command('search-identity <username>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Search users by username')
    .action(searchIdentity);

//find did by id
program
    .command('find-identity <identityId>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Find identity by identity id')
    .action(findIdentity);

//add did to bridge
program
    .command('add-identity <pathToAddIdentityFile>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Add identity to bridge')
    .action(addIdentity);

//delete did from bridge
program
    .command('remove-identity <identityId>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .option('-r, --revoke')
    .description('Remove identity by identity id')
    .action(removeIdentity);

//update did
program
    .command('update-identity <updateFile>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Update with supplied document')
    .action(updateIdentity);

// return latest document of did
program
    .command('get-identity <identityId>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Returns latest document by id')
    .action(latestDocument);

//get trusted root identities
program
    .command('get-trusted')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Get trusted root identities')
    .action(getTrustedAuthorities);

//add trusted root identity
program
    .command('add-trusted <authorityId>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Add trusted root identity')
    .action(addTrustedAuthority);

//remove trusted root identity by id
program
    .command('remove-trusted <authorityId>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Remove trusted root identity by id')
    .action(removeTrustedAuthority);

//check verifiable credential
program
    .command('check-vc <credentialFile')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Check the verifiable credential of an identity')
    .action(checkCredential);

//revoke verifiable credential
program
    .command('revoke-vc <signatureValue>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Revoke one specific verifiable credential of an identity')
    .action(revokeCredential);

program
    .command('create-channel <name>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .requiredOption('-t, --type <type-of-channel>')
    .requiredOption('-s, --source <source-of-channel>')
    .description('Create a channel')
    .action(createChannel);

program
    .command('write-channel <address>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .requiredOption('-p, --payload <message-payload>')
    .description('Write data into channel')
    .action(writeChannel);

program
    .command('read-channel <address>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .option('-li, --limit <number>')
    .option('-in, --index <number>')
    .option('-o, --order <boolean>')
    .option('-sD, --startDate <date>')
    .option('-eD, --endDate <date>')
    .description('Get data from the channel with address channel address.')
    .action(readChannel);

program
    .command('setup-node')
    .description('Setup node environment for API')
    .action(() => setupApi('node'));
program
    .command('setup-docker')
    .description('Setup docker environment for API')
    .action(() => setupApi('docker'));

if (process.argv.length < 3) {
    program.help();
} else {
    program.parse(process.argv);
}
