import { program } from 'commander';
import {createChannel, read, searchChannel, write} from './channel.js';
import { configure } from './config.js';
import { addTrustedAuthority, checkCredential, createCredential, createIdentity, findIdentity, getTrustedAuthorities, latestDocument, removeIdentity, removeTrustedAuthority, revokeCredential, searchIdentity, updateIdentity } from './identity.js';

program.version('0.1.0');

program
    .command('local-config')
    .requiredOption('-s, --ssiBridgeUrl <SSI Bridge URL>')
    .requiredOption('-a, --auditTrailUrl <Audit Trail URL>')
    .option('-k, --apiKey <api Key>')
    .description('Config')
    .action(configure);

program
    .command('prod-config')
    .option('-isGatewayUrl, --g <Gateway URL>')
    .option('-k, --apiKey <api Key>')
    .description('Config')
    .action(configure);

//create did
program.command('create').argument('<create.json>', 'Path to DID file', createIdentity);

// search dids by username
program
    .command('search <username>')
    .option('-i, --identity <admin-identity.json>')
    .description('Search users by username')
    .action(searchIdentity);

//find did by id
program
    .command('find <identity>')
    .option('-i, --identity <admin-identity.json>')
    .description('Find identity by id')
    .action(findIdentity);

//delete did by id
program
    .command('remove <identityId>')
    .option('-i, --identity <admin-identity.json>')
    .option('-r, --revoke')
    .description('Remove identity by id')
    .action(removeIdentity);

//update did
program
    .command('update <updateFile>')
    .option('-i, --identity <admin-identity.json>')
    .description('Update DID')
    .action(updateIdentity);

// return latest document of did
program
    .command('get <identityId>')
    .option('-i, --identity <admin-identity.json>')
    .description('Returns latest document by id')
    .action(latestDocument);

//get trusted root identities
program
    .command('root')
    .option('-i, --identity <admin-identity.json>')
    .description('Get trusted root identities')
    .action(getTrustedAuthorities);

//add trusted root identity
program
    .command('add root <identityId>')
    .option('-i, --identity <admin-identity.json>')
    .description('Add trusted root identity')
    .action(addTrustedAuthority);

//remove trusted root identity by id
program
    .command('add remove <authorityId>')
    .option('-i, --identity <admin-identity.json>')
    .description('Remove trusted root identity by id')
    .action(removeTrustedAuthority);

//create verifiable credential
program
    .command('createvc <credentialFile>')
    .option('-i, --identity <identity.json>')
    .description(
        'Verify the authenticity of an identity (of an individual, organization or object) and issue a credential stating the identity verification status.'
    )
    .action(createCredential);

//check verifiable credential
program
    .command('checkvc <credentialFile')
    .option('-i, --identity <identity.json>')
    .description('Check the verifiable credential of an identity')
    .action(checkCredential);

//revoke verifiable credential
program
    .command('revokevc <signatureValue>')
    .description('Revoke one specific verifiable credential of an identity')
    .action(revokeCredential);

program
    .command('create-channel')
    .option('-i, --identity <admin-identity.json')
    .option('-a, --apply <channel.json>')
    .description('Create DID')
    .action(createChannel);

program
    .command('write <address>')
    .option('-i, --identity <admin-identity.json')
    .description('Write data into channel')
    .action(write);

program
    .command('read <address>')
    .option('-a, --admin <admin-identity.json>')
    .option('-l, --limit <number>')
    .option('-i, --index <number>')
    .option('-o, --order <boolean>')
    .option('-sD, --startDate <date>')
    .option('-eD, --endDate <date>')
    .description('Get data from the channel with address channel address.')
    .action(read);

program.parse(process.argv);
