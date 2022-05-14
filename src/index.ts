import { program } from 'commander';
import { createChannel, readChannel, subscribe, authorize, writeChannel } from './channel.js';
import { makeAdmin } from './admin.js';
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
    updateIdentity,
} from './identity.js';
import { setupApi } from './setup-api.js';

program
    .name("is")
    .version('0.0.20', '-v, --vers', 'output the current version')
    .description("CLI to Integration Services APIs: manage Identities and Channels with ease.")
    .showSuggestionAfterError()

program
    .command('config')
    .description('Configure CLI to reach out the API endpoints')
    .option('-s, --ssiBridgeUrl <SSI Bridge URL>')
    .option('-a, --auditTrailUrl <Audit Trail URL>')
    .option('-g, --isGatewayUrl <Gateway URL>')
    .option('-k, --apiKey <api Key>')
    .option('-v, --apiVersion <api version>')
    .action(configure);

//create did
program
    .command('create-identity')
    .option('-i, --identityFile <path-to-identity-file>')
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
    .command('subscribe-channel <address>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Subscribe identity to channel specified by the address.')
    .action(subscribe);

program
    .command('authorize-channel <address> <did>')
    .requiredOption('-i, --identityFile <path-to-identity-file>')
    .description('Authorize an identity to write into the channel specified by the address.')
    .action(authorize);

program
    .command('make-admin')
    .description('Assign Admin role to an identity.\nIt requires access to Integration Services deployment via kubectl.\nIntegration Services needs to be installed via Helm Chart.')
    .requiredOption('-i, --identity <DID of the identity to make Admin>')
    .requiredOption('-d, --deploymentName <Name of the deployed Helm chart>')
    .option('-n, --namespace <Namespace>')
    .action(makeAdmin);

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
