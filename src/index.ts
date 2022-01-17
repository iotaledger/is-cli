#! /usr/bin/env node

let program = require("commander")
const configurations = require('home-config').load('config.ini');
const identity = require('../dist/identity')
const channel = require('../dist/channel')


program.version('0.1.0')


program
  .command('login')
  .option('-a, --admin <admin-config.ini>')
  .option('-o, --output <admin-identity.json>')
  .description('Login')
  .action(identity.login)

//create did
program
  .command('create')
  .option('-c, --config <config.ini>')
  .option('-i, --identity <admin-identity.json')
  .option('-a, --apply <create.yml>')
  .description('Create DID')
  .action(identity.create)

// search dids by username
program
  .command('search <username')
  .option('-c, --config <config.ini>')
  .option('-i, --identity <admin-identity.json')
  .description('Search users by username')
  .action(identity.search)

//find did by id  
program
  .command('find <identity>')
  .option('-c, --config <config.ini>')
  .option('-i, --identity <admin-identity.json>')
  .description('Find identity by id')
  .action(identity.find)

//delete did by id 
program
  .command('remove <identityId')
  .option('-i, --identity <admin-identity.json>')
  .option('-c, --config <config.ini>')
  .option('-r, --revoke')
  .description('Remove identity by id')
  .action(identity.remove)

//update did 
program
  .command('update <updateFile>')
  .option('-c, --config <config.ini>')
  .option('-i, --identity <admin-identity.json>')
  .description('Update DID')
  .action(identity.update)

// return latest document of did  
program
  .command('get <identityId>')
  .option('-c, --config ')
  .option('-i, --identity <admin-identity.json>')
  .description('Returns latest document by id')
  .action(identity.latestDocument)

//get trusted root identities  
program
  .command('root')
  .option('-c, --config ')
  .option('-i, --identity <admin-identity.json>')
  .description('Get trusted root identities')
  .action(identity.getTrustedAuthorities)

//add trusted root identity
program
  .command('add root')
  .option('-c, --config ')
  .option('-i, --identity <admin-identity.json>')
  .description('Add trusted root identity')
  .action(identity.addTrustedAuthority)

//remove trusted root identity by id
program
  .command('add remove <authorityId>')
  .option('-c, --config ')
  .option('-i, --identity <admin-identity.json>')
  .description('Remove trusted root identity by id')
  .action(identity.removeTrustedAuthority)

//create verifiable credential   
program
  .command('createvc <credentialFile>')
  .option('-c, --config ')
  .option('-i, --identity <identity.json>')
  .description('Verify the authenticity of an identity (of an individual, organization or object) and issue a credential stating the identity verification status.')
  .action(identity.createCredential)

//check verifiable credential
program
  .command('checkvc <credentialFile')
  .option('-c, --config ')
  .option('-i, --identity <identity.json>')
  .description('Check the verifiable credential of an identity')
  .action(identity.checkCredential)

//revoke verifiable credential  
program
  .command('revokevc <signatureValue>')
  .description('Revoke one specific verifiable credential of an identity')
  .action(identity.revokeCredential)


program
  .command('create-channel')
  .option('-c, --config <config.ini>')
  .option('-i, --identity <admin-identity.json')
  .option('-a, --apply <channel.yml>')
  .description('Create DID')
  .action(channel.createChannel)

program
  .command('read <address>')
  .option('-c, --config <config.ini>')
  .option('-a, --admin <admin-identity.json>')
  .option('-l, --limit <number>')
  .option('-i, --index <number>')
  .option('-o, --order <boolean>')
  .option('-sD, --startDate <date>')
  .option('-eD, --endDate <date>')
  .description('Get data from the channel with address channel address.')
  .action(channel.read)



program.parse(process.argv);