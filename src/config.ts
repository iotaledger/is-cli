const nconf = require('nconf');
const os = require('os');
const path = require('path');

exports.configure = async (options: { baseUrl: string, apiKey: string }) => {
    try {
        nconf.file({ 
            file: path.join(os.homedir(), '.iota-is.json')
        });

        nconf.set('baseUrl', options.baseUrl);
        nconf.set('apiKey', options.apiKey);

        await nconf.save();
    } catch (ex: any) {
        console.log(ex);
    }
}
