const Discord = require('discord.js');
const https = require('https');

require('dotenv').config();
const { request, gql, GraphQLClient } = require('graphql-request')

const client = new Discord.Client();

const prefix = '$';

client.once('ready', () => {
  console.log("Online")
})

var rooms;

async function main() {
  const endpoint = 'https://one-zork.herokuapp.com/graphql'
  const graphQLClient = new GraphQLClient(endpoint, {
    Headers: {
      apiKey: process.env.VULCAN,
    },
  })
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

  if(command === 'bye') {
    message.channel.send("bye");
    client.destroy();
  }

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

client.login(process.env.DISCORD); 

async function insertMessage(roomId, message) {
  const endpoint = 'https://one-zork.herokuapp.com/graphql'
  const graphQLClient = new GraphQLClient(endpoint, {
    Headers: {
      apiKey: process.env.VULCAN,
    },
  });
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
  console.log(results);
}