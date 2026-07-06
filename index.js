const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

const ADMINS = [
    "1398361839678783739",  // ← Coloca seu ID do Discord aqui!
];

let whitelist = [];

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const args = message.content.split(' ');
    const comando = args[0].toLowerCase();
    const usuario = args[1];

    if (comando === '!adicionar') {
        if (!ADMINS.includes(message.author.id)) {
            return message.reply('❌ Você não tem permissão!');
        }
        if (!usuario) {
            return message.reply('⚠️ Use: !adicionar NICK');
        }
        if (!whitelist.includes(usuario)) {
            whitelist.push(usuario);
            message.reply(`✅ ${usuario} adicionado à whitelist!`);
        } else {
            message.reply(`⚠️ ${usuario} já está na whitelist!`);
        }
    }

    if (comando === '!remover') {
        if (!ADMINS.includes(message.author.id)) {
            return message.reply('❌ Você não tem permissão!');
        }
        if (!usuario) {
            return message.reply('⚠️ Use: !remover NICK');
        }
        const index = whitelist.indexOf(usuario);
        if (index > -1) {
            whitelist.splice(index, 1);
            message.reply(`✅ ${usuario} removido da whitelist!`);
        } else {
            message.reply(`⚠️ ${usuario} não está na whitelist!`);
        }
    }

    if (comando === '!lista') {
        if (!ADMINS.includes(message.author.id)) {
            return message.reply('❌ Você não tem permissão!');
        }
        if (whitelist.length === 0) {
            return message.reply('📋 Nenhum usuário na whitelist.');
        }
        let lista = '📋 **USUÁRIOS NA WHITELIST:**\n';
        whitelist.forEach((user, index) => {
            lista += `${index + 1}. ${user}\n`;
        });
        message.reply(lista);
    }

    if (comando === '!ping') {
        message.reply(`🏓 Pong! Latência: ${client.ws.ping}ms`);
    }
});

// ✅ NOVO: Verificação se o bot tá online
client.once('ready', () => {
    console.log(`✅ Bot ${client.user.tag} está online!`);
    console.log(`📋 ${client.guilds.cache.size} servidores conectados`);
});

app.get('/check', (req, res) => {
    const user = req.query.user;
    if (!user) return res.send('false');
    res.send(whitelist.includes(user) ? 'true' : 'false');
});

app.get('/list', (req, res) => {
    res.json(whitelist);
});

app.get('/', (req, res) => {
    res.send('🤖 FND Whitelist Bot está online!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});

client.login(process.env.TOKEN);
