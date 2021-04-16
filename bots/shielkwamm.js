const Discord = require('discord.js');
const https = require('https');
const fetch = require("node-fetch");

require('dotenv').config();
const { request, gql, GraphQLClient } = require('graphql-request')

const client = new Discord.Client();

const prefix = '$';

client.once('ready', () => {
  console.log("Shielkwamm Online")
})


var rooms;

async function main() {
  const endpoint = 'https://sh.shielkwamm.com/graphql'
  const graphQLClient = new GraphQLClient(endpoint)
  const query = gql`
    {
      rooms {
        results {
          _id
          name
        }
      }
    }
  `

  const data = await graphQLClient.request(query)
  //const roomsData = JSON.stringify(data, undefined, 2);
  rooms = data.rooms.results;
}

main().catch((error) => console.error(error))

client.on('message', message => {
  let room = rooms.find((room) => room.name === message.channel.name)
  insertMessage(room._id, message.author.username + " : " + message.content);

  if(!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift();
})

client.login(process.env.DISCORD_SH);


async function insertMessage(roomId, message) {
  const endpoint = 'https://sh.shielkwamm.com/graphql'
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {apiKey: process.env.VULCAN}
  });
  //graphQLClient.setHeader({apiKey: process.env.VULCAN});
  const variables = {
    createMessageInput: {
      data: {
        roomId: roomId,
        text: message
      }
    }
  }
  const mutation = gql`
    mutation CreateMessageMutation($createMessageInput: CreateMessageInput) {
      createMessage(input: $createMessageInput) {
        data {
          roomId,
          text
        }
      }
    }
  `;

  const results = await graphQLClient.request(mutation, variables);
}