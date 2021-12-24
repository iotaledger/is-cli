#! /usr/bin/env node



let program = require("commander")
const configurations = require('home-config').load('config.ini');
const util = require('../dist/util')


program.version('0.1.0')

program
  .command('mk')
  .option('-c, --create <file>')
  .description('Create DID')
  .action(util.create)


program
  .command('s')
  .option('-u, --username <username>')
  .description('Search User')
  .action(util.search)

program
  .command('f')
  .option('-d, --did <identityId>')
  .description('Find identity by id')
  .action(util.find)

program
  .command('rm')
  .option('-d, --did <identityId>')
  .description('Remove identity by id')
  .action(util.remove)

program
  .command('u')
  .option('-p, --put <identity>')
  .action(util.update)

program
  .command('doc <identityId>')
  .description('Returns latest document by id')
  .action(util.latestDocument)

program
  .command('tr')
  .description('Get trusted root identities')
  .action(util.getTrustedAuthorities)

program
  .command('cvc <credentialFile>')
  .description('Verify the authenticity of an identity (of an individual, organization or object) and issue a credential stating the identity verification status.')
  .action(util.createCredential)


program
  .command('add <identity>')
  .description('Register existing identity into the Bridge')
  .action(util.add)






program.parse(process.argv);