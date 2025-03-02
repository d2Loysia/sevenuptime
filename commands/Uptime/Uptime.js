const db = require('croxydb');
const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { UserData } = require('../../data/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Sunucuya uptime sistemi kurar.')
        .addSubcommand(x => x
            .setName("ayarla").setDescription("Sunucuya uptime sistemi kurar.")
            .addChannelOption(x =>
                x.setName("channel").setDescription("Uptime sistemi hangi kanala kurulacak?").setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(x => x
            .setName("sıfırla").setDescription("Sunucudaki uptime sistemini kapatır.")),
    async execute(interaction) {
        const client = interaction.client;
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`> ${client.emoji.error} Bu komutu sen kullanamazsın!`)
                ]
            })
        }

        const cmd = interaction.options.getSubcommand()
        if (cmd == "ayarla") {
            const data = db.fetch(`uptime.guilds.guild_${interaction.guild.id}.channel`)
            if (!data) {
                const channel = interaction.options.getChannel("channel")
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("add_link")
                            .setLabel("Link Ekle")
                            .setEmoji(client.emoji.online)
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("delete_link")
                            .setLabel("Link Sil")
                            .setEmoji(client.emoji.offline)
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId("list_link")
                            .setLabel("Linklerim")
                            .setEmoji(client.emoji.link)
                            .setStyle(ButtonStyle.Primary)
                    )
                db.set(`uptime.guilds.guild_${interaction.guild.id}.channel`, channel.id)
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`> ${client.emoji.success} Uptime sistemi başarıyla ${channel} kanalına ayarlandı!`)
                    ]
                })

                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(interaction.guild.name)
                            .setThumbnail(interaction.guild.iconURL())
                            .setImage("https://cdn.discordapp.com/attachments/1205813721029673001/1322908505392414801/standard.gif?ex=6772960e&is=6771448e&hm=3dbe1694647c8734d838de50b202914b62969b641d49cea19f4f3f75cfd71565&")
                            .setDescription(`
> ${client.emoji.bot} Projeni **7/24** yapmak için alttaki butonları kullanabilirsin!

> ${client.emoji.online} Aşağıdaki **Link Ekle** butonuna tıklayarak projeni ekleyebilirsin!

> ${client.emoji.offline} Aşağıdaki **Link Sil** butonuna tıklayarak projeni kaldırabilirsin!

> ${client.emoji.link} Aşağıdaki **Linklerim** butonuna tıklayarak eklemiş olduğun projeleri görürsün!


> ***REKLAM PANOSUNA REKLAM VERMEK İÇİN DM <@702791382661595177>***
`)
                            .setFooter({ text: `${client.user.username} ~ loysiaofficial`, iconURL: client.user.displayAvatarURL() })
                    ], components: [row]
                })
            } else {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`> ${client.emoji.error} Uptime sistemi zaten bu sunucuda ayarlı! Sıfırlamak için \`/uptime sıfırla\` komutunu kullanın!`)
                    ]
                })
            }
        } else if (cmd == "sıfırla") {
            const data = db.fetch(`uptime.guilds.guild_${interaction.guild.id}.channel`);
            if (data) {
                db.delete(`uptime.guilds.guild_${interaction.guild.id}.channel`);
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`> ${client.emoji.success} Uptime sistemi başarıyla sıfırlandı!`)
                    ]
                });
            } else {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`> ${client.emoji.error} Uptime sistemi zaten bu sunucuda ayarlı değil!`)
                    ]
                });
            }
        }
    },
};