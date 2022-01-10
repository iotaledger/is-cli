#! /usr/bin/env node

let program = require("commander")
const configurations = require('home-config').load('config.ini');
const util = require('../dist/util')


program.version('0.1.0')

program
  .command('create')
  .option('-a, --apply <file>')
  .description('Create DID')
  .action(util.create)

program
  .command('search <username>')
  .description('Search users by username')
  .action(util.search)

program
  .command('find <identityId>')
  .description('Find identity by id')
  .action(util.find)

program
  .command('remove <identityId>')
  .option('-r, --revoke')
  .description('Remove identity by id')
  .action((identityId, options) => {
    options.revoke ? util.remove(identityId, true) : util.remove(identityId);
  })

program
  .command('update <updateFile>')
  .description('Update DID')
  .action(util.update)

program
  .command('get <identityId>')
  .description('Returns latest document by id')
  .action(util.latestDocument)

program
  .command('root')
  .description('Get trusted root identities')
  .action(util.getTrustedAuthorities)

program
  .command('createvc <credentialFile>')
  .description('Verify the authenticity of an identity (of an individual, organization or object) and issue a credential stating the identity verification status.')
  .action(util.createCredential)

program
  .command('checkvc <credentialFile')
  .description('Check the verifiable credential of an identity')
  .action(util.checkCredential)

program
  .command('revokevc <signatureValue>')
  .description('Revoke one specific verifiable credential of an identity')
  .action(util.revokeCredential)

program.parse(process.argv);