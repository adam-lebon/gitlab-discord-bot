class Gitlab {
    constructor(config, discord) {
        this.config = config;
        this.token = config.token;
        this.actions = config.actions;
        this.discord = discord;
    }

    async processEvent(event) {
        console.log(JSON.stringify(event, null, 2));
        const channel = this.discord.client.channels.get('478243810749448203');
        
        if (event.event_name === 'push'){
            const user = this.config.users[event.user_email] ? `<@${this.config.users[event.user_email]}>` : event.user_username;
            const branch = event.ref.replace('refs/heads/', '');
            const commitCount = event.commits.length;
            const commits = event.commits.map((commit) => {
                return `*"${commit.message.replace(/\n+$/g, '')}"*
    \:white_check_mark: ${commit.added.length} fichiers ajoutés
    \:pencil2: ${commit.modified.length} fichiers modifiés
    \:x: ${commit.removed.length} fichiers supprimés`;
            });

            await channel.send(
                `\:rocket: **${user} a push ${commitCount > 1 ? commitCount : 'un'} commit${commitCount>1? 's': ''} sur la branche ${branch}** \:smile:\n${commits.join('\n\n')}`
            );

        } else if (event.event_type =='note') {

            const commentAuthor = event.user.username;
            /*const commitAuthor = this.config.users[event.commit.author.email]
                ? `<@${this.config.users[event.commit.author.email]}>`
                : event.commit.author.name;*/
            const commitAuthor = 'tamere';
            await channel.send(`\:pencil: **${commentAuthor} a commenté un(e) ${event.object_attributes.noteable_type.toLowerCase()} de ${commitAuthor}:**
    *"${event.object_attributes.note}"*
    ${event.object_attributes.url}`);

        } else if(event.event_type === 'merge_request') {
            
            const author = this.config.users[event.object_attributes.last_commit.author.email]
                ? `<@${this.config.users[event.object_attributes.last_commit.author.email]}>`
                : event.object_attributes.last_commit.author.name;
            const { source_branch, target_branch, title } = event.object_attributes;
            await channel.send(`**${author} à ouvert un merge request de \`${target_branch}\` \:arrow_right: \`${source_branch}\`**
    *"${title}"*`);
            
        } else {
            
        }
    }
}

module.exports = {
    Gitlab
};
