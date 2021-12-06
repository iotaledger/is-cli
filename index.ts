import { ClientConfig } from 'iota-is-client';
import { Manager } from 'iota-is-client';
import { ApiVersion } from 'iota-is-client';
import { Identity } from 'iota-is-client';
import { IdentityInternal } from 'iota-is-client';

async function bootstrap() {
  try {

    let manager = new Manager(
      'mongodb+srv://JuriB:BetterThanNothing@cluster0.6q0bv.mongodb.net/test?authSource=admin&replicaSet=atlas-10j2kz-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', 
      'integration-services', 
      'PpKFhPKJY2efTsN9VkB7WNtYUhX9Utaa'
    );

    let rootId = await manager.getRootIdentity();

    await manager.close();

    console.log('Root Identity', rootId);

    const config: ClientConfig = {
      apiKey: '6c57f6ee-14f4-40ba-90a3-5858a1155133',
      baseUrl: 'http://127.0.0.1:3000',
      apiVersion: ApiVersion.v1
    }
     
    let api = new Identity(config);
 
    // Became root identity
    await api.authenticate(rootId);
    
    console.log(api.jwtToken)

    // Get information about root identity
    let rootIdentity = (await api.find(rootId?.doc?.id)) as IdentityInternal;
    const verifiableCredentials = rootIdentity!.verifiableCredentials;
    let identityCredential = verifiableCredentials ? verifiableCredentials[0] : null
    if (!identityCredential) {
      throw new Error('root identity has no credential')
    }

    console.log('Root Identity Credentials', identityCredential);

    // Verify the credential issued
    let verified = await api.checkCredential(identityCredential);

    console.log('Verification result', verified);
    
    // Create identity for tester
    let userIdentity = await api.create('tester user', {
      type: 'user'
    });

    console.log('Tester Identity', userIdentity);

    // Assign a verifiable credential to the tester as rootIdentity
    let vc = await api.createCredential(identityCredential!, userIdentity?.doc?.id, {
      profession: 'Professor'
    });

    console.log("Credential created", vc);

    console.log('Tester Verifiable Credential');

    // Verify the credential issued
    let verified2 = await api.checkCredential(identityCredential);

    console.log('Verification result', verified2);

  } catch (e: any) {
    console.log(e);
  }
}

bootstrap();