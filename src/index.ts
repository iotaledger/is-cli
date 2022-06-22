import { program } from 'commander';
import {
    createChannel,
    readChannel,
    subscribe,
    authorize,
    writeChannel,
    readHistory,
    validateLogs,
    reimportChannel,
    addSubscription,
    updateSubscription,
    removeSubscription,
    revokeSubscription,
    findSubscription,
    findAllSubscriptions,
    searchChannel,
    getChannelInfo,
    addExistingChannel,
    updateChannelInfo,
    removeChannelInfo
} from './channel.js';
import { makeAdmin } from './admin.js';
import { configure } from './config.js';
import {
    addIdentity,
    addTrustedAuthority,
    checkCredential,
    createCredential,
    createIdentity,
    findIdentity,
    getJwt,
    getTrustedAuthorities,
    latestDocument,
    removeIdentity,
    removeTrustedAuthority,
    revokeCredential,
    searchIdentity,
    updateIdentity,
    verifyJwt,
} from './identity.js';
import { setupApi } from './setup-api.js';

program
    .name("is")
    .version('0.0.23', '-v, --vers', 'output the current version')
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

program
    .command('create-identity')
    .description('Create a new DID with a .json file')
    .requiredOption('-o, --outputFile <Path to output file>')
    .option('-i, --identityFile <Path to identity claim file or stdin>')
    .action(createIdentity);

program
    .command('search-identity <username>')
    .description('Search users by username')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .option('-o, --outputFile <Path to output file>')
    .action(searchIdentity);

program
    .command('find-identity <identityId>')
    .description('Find identity by identity id')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .option('-o, --outputFile <Path to output file>')
    .action(findIdentity);

program
    .command('add-identity <Path to add-identity file>')
    .description('Add identity to bridge')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .action(addIdentity);

program
    .command('remove-identity <identityId>')
    .description('Remove identity by identity id')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .option('-rC, --revokeCredential')
    .action(removeIdentity);

program
    .command('update-identity <updateFile>')
    .description('Update with supplied document')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .action(updateIdentity);

program
    .command('get-identity <identityId>')
    .description('Returns latest document by id')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .option('-o, --outputFile <Path to output file>')
    .action(latestDocument);

program
    .command('make-admin')
    .description('Assign Admin role to an identity.\nIt requires access to Integration Services deployment via kubectl.\nIntegration Services needs to be installed via Helm Chart.')
    .requiredOption('-i, --identity <DID of the identity to make Admin>')
    .requiredOption('-d, --deploymentName <Name of the deployed Helm chart>')
    .option('-n, --namespace <Namespace>')
    .action(makeAdmin);

program
    .command('get-trusted')
    .description('Get trusted root identities')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .option('-o, --outputFile <Path to output file>')
    .action(getTrustedAuthorities);

program
    .command('add-trusted <authorityId>')
    .description('Add trusted root identity')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .action(addTrustedAuthority);

program
    .command('remove-trusted <authorityId>')
    .description('Remove trusted root identity by id')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .action(removeTrustedAuthority);

program
    .command('get-jwt')
    .description('Get JWT of identity.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .option('-o, --outputFile <Path to output file>')
    .action(getJwt);

program
    .command('verify-jwt <jwt>')
    .description('Check the verifiable credential of an identity. Validates the signed verifiable credential against the Issuer information stored onto the IOTA Tangle and checks if the issuer identity (DID) contained in the credential is from a trusted root.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .action(verifyJwt);

program
    .command('create-vc')
    .description('Create a new VC')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-d, --did <Target DID for the VC>')
    .requiredOption('-c, --credentialFile <Path to credential-claim file (or stdin)>')
    .option('-o, --outputFile <Path to output file>')
    .action(createCredential);

program
    .command('check-vc <credentialFile>')
    .description('Check the verifiable credential of an identity')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .action(checkCredential);

program
    .command('revoke-vc <signatureValue>')
    .description('Revoke one specific verifiable credential of an identity')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .action(revokeCredential);

program
    .command('create-channel <name>')
    .description('Create a channel')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-t, --type <Type of topic>')
    .requiredOption('-s, --source <Source of topic>')
    .option('-o, --outputFile <Path to output file>')
    .option('-pC, --publicChannel')
    .option('-sK, --presharedKey')
    .option('-d, --description <Channel description>')
    .action(createChannel);

program
    .command('write-channel')
    .description('Write data into channel')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-p, --payload <Message payload>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .action(writeChannel);

program
    .command('read-channel')
    .description('Get data from the channel with address channel address.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .option('-li, --limit <number>')
    .option('-in, --index <number>')
    .option('-o, --order <boolean>')
    .option('-sD, --startDate <date>')
    .option('-eD, --endDate <date>')
    .option('-o, --outputFile <Path to output file>')
    .action(readChannel);

program
    .command('read-channel-history')
    .description('Read history of a channel')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .option('-sK, --presharedKey <Preshared key for private channels>', 'If interested in private channels the preshared key needs to be provided.')
    .option('-pC, --publicChannel')
    .option('-o, --outputFile <Path to output file>')
    .action(readHistory);

program
    .command('subscribe-channel')
    .description('Subscribe identity to channel specified by the address.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .option('-s, --seed <Seed of channel>')
    .option('-aR, --accessRights <Access rights: Audit, Read, Write, ReadAndWrite>')
    .option('-sK, --presharedKey <Preshared key of channel>')
    .action(subscribe);

program
    .command('authorize-subscription <id>')
    .description('Authorize an identity to write into the channel specified by the address.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .action(authorize);

program
    .command('validate-logs')
    .description('Validates channel data by comparing the log of each link with the data on the tangle.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .requiredOption('-d, --dataFile <Path to channel-data file>')
    .action(validateLogs)

program
    .command('reimport-channel')
    .description('Re-import the data from the Tangle into the database. A reason for it could be a malicious state of the data.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .option('-p, --password <Subscription password>')
    .action(reimportChannel)

program
    .command('search-channel')
    .description('Search for a channel.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .option('-aI, --authorId <Author of the channel>')
    .option('-sI, --subscriberId <Subscriber of the channel')
    .option('-rsI, --requestedSubscriptionId <Issuer of the requested Subscription')
    .option('-n, --name <Channel name>')
    .option('-cT, --channelType <Private or public channel>')
    .option('-tT, --topicType <Type of topic>')
    .option('-sT, --topicSource <Source of topic>')
    .option('-c, --created <Date of creation>')
    .option('-lM, --latestMessage <Latest message>')
    .option('-l, --limit <number>')
    .option('-i, --index <number>')
    .option('-a, --ascending')
    .option('-o, --outputFile <Path to output file>')
    .action(searchChannel)

program
    .command('channel-info')
    .description('Get channel information.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .option('-o, --outputFile <Path to output file>')
    .action(getChannelInfo)

program
    .command('add-channel')
    .description('Add an existing channel into the database.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .action(addExistingChannel)

program
    .command('update-channel')
    .description('Update channel information. The author of a channel can update topics of a channel.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .action(updateChannelInfo)

program
    .command('remove-channel')
    .description('Delete information of a channel with channel-address. The author of a channel can delete its entry in the database. In this case all subscriptions will be deleted and the channel won’t be found in the system anymore. The data & channel won’t be deleted from the IOTA Tangle since its data is immutable on the tangle!')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .action(removeChannelInfo)

program
    .command('add-subscription')
    .description('Adds an existing subscription (e.g. the subscription was not created with the api but locally.)')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-s, --subscriptionFile <Path to subscription file>')
    .requiredOption('-sI, --subscriberId <Id of subscriber>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .action(addSubscription)

program
    .command('update-subscription')
    .description('Update an existing subscription.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-s, --subscriptionFile <Path to subscription file>')
    .requiredOption('-sI, --subscriberId <Id of subscriber>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .action(updateSubscription)

program
    .command('remove-subscription')
    .description('Delete an existing subscription.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-sI, --subscriberId <Id of subscriber>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .action(removeSubscription)

program
    .command('revoke-subscription')
    .description('Revoke subscription to a channel. Only the author of a channel can revoke a subscription from a channel.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .option('-sI, --subscriberId <Id of subscriber>')
    .option('-sL, --subscriptionLink <Subscription link>')
    .action(revokeSubscription)

program
    .command('find-subscription')
    .description('Get a subscription of a channel by subscriber id.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .requiredOption('-sI, --subscriberId <Id of subscriber>')
    .option('-o, --outputFile <Path to output file>')
    .action(findSubscription)

program
    .command('find-all-subscriptions')
    .description('Get all subscriptions of a channel.')
    .requiredOption('-i, --identityFile <Path to identity file>')
    .requiredOption('-c, --channelFile <Path to channel file>')
    .option('-iA, --isAuthorized')
    .option('-o, --outputFile <Path to output file>')
    .action(findAllSubscriptions)

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
