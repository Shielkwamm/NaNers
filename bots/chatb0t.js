const Discord = require('discord.js');
const https = require('https');
const fetch = require("node-fetch");

require('dotenv').config();

const client = new Discord.Client();

const prefix = '$';

client.once('ready', () => {
  console.log("Chatb0t Online")
})

client.on('message', message => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift();

  console.log(args, command);

  if(command === 'getRandomCatFact') {
    const req = https.get('https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1', (res) => {
    res.setEncoding('utf8');
    let catFact = "";
    res.on('data', (d) => {
      catFact += d;
    })
    res.on('end', () => {
      const catFacts = JSON.parse(catFact);
      message.channel.send(catFacts.text)
    })
  })
  }
})

client.login(process.env.DISCORD_CB);