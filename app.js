const { Headers } = require('cross-fetch');

// @ts-ignore
global.Headers = global.Headers || Headers;

//{apiKey: process.env.VULCAN}

require('./bots/shielkwamm.js')
require('./bots/arbitrat0r.js')
require('./bots/chatb0t.js')
require('./bots/arbitrat0r.js')
require('./bots/operat0r.js')
require('./bots/informati0n.js')