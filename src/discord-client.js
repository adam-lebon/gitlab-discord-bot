const { Client } = require('discord.js');
const { logger } = require('./logger');

class DiscordClient {
    /**
     * Discord client constructor
     * @param {string} token Discord server secret token
     */
    constructor(token) {
        this.client = new Client();
        this.token = token;
        this.client.on('warn', (warn) => logger.warn('discord', warn));
        this.client.on('error', (error) => logger.error('discord', error.message));
        this.client.on('debug', (debug) => logger.debug('discord', debug));
        this.client.on('rateLimit', (...a) => console.log(a));
        this.client.on('resume', () => console.log('resume'));
        this.client.on('message', (message) => {
            if (message.content == 'ping') {
                message.reply('pong');
            }
        })
    }

    /**
     * Connect the client to the discord server
     */
    async connect() {
        await this.client.login(this.token);
        logger.info('discord', `Connected with name "${this.client.user.tag}"`);
        logger.info('discord', `Connected to ${this.client.guilds.size} servers`);
    }
}

module.exports = {
    DiscordClient
};
