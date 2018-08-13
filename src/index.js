const config = require('./conf.json');
const { DiscordClient } = require('./discord-client');
const { Webserver } = require('./webserver');
const { Gitlab } = require('./gitlab');
const { logger } = require('./logger');

class App {
    constructor() {
        this.config = config;
        this.validateConfig();

        
        this.webserver = new Webserver(8000);
        this.webserver.listen();
        this.webserver.requests.subscribe((req) => this.gitlabHook(req));
        
        this.discord = new DiscordClient(this.config.token);
        this.discord.connect();
        
        /**
         * Store all gitlab instance by it's token
         */
        this.gitlabs = new Map();
        for (let server of this.config.gitlabs) {
            this.gitlabs.set(server.token, new Gitlab(server, this.discord));
        }
    }

    validateConfig() {
        if (typeof this.config.token !== 'string') {
            throw new TypeError(`Error in config 'token' should be a string instead of a ${typeof this.config.token}`);
        }
    }

    gitlabHook(req) {
        const gitlabToken = req.headers['x-gitlab-token'];
        if (!gitlabToken) {
            logger.warn('app', 'Received a request without gitlab token');
        } else if (!this.gitlabs.has(gitlabToken)) {
            logger.warn('app', `The server with token "${gitlabToken}" is not configured in the conf.json`);
        } else {
            this.gitlabs.get(gitlabToken).processEvent(req.body);
        }
    }
}

const app = new App();
