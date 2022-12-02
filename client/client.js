const {createClient} = require('graphql-ws')
const {WebSocket} = require('ws')
require('dotenv').config()

const APIKEY = process.env.APIKEY
const ACCOUNT = process.env.STEPZEN_ACCOUNT
const QUERY = process.env.GRAPHQL_QUERY

let url = 'ws://localhost:9000/stepzen-subscriptions/api/subscription/__graphql'
let query = 'subscription { rand }'
// query = 'subscription { changes { rand }}'
// query = 'subscription { randFromChanges }'
// query = 'subscription { changes { rand time }}'
if (QUERY) {
  query = QUERY
}
console.log(`running: ${query}`)

if (!APIKEY) {
  console.log('You must add your APIKEY to the .env file')
  process.exit(1)
}

if (ACCOUNT && ACCOUNT != 'graphql') {
  console.log(`wss "${ACCOUNT}" on stepzen service version`)
  url = `wss://${ACCOUNT}.stepzen.net/stepzen-subscriptions/api/subscription/__graphql`
} else {
  console.log(`ws local version`)
}

const client = createClient({
  webSocketImpl: WebSocket,
  url: url,
  connectionParams: () => {
    return {
      headers: {
        Authorization: `apikey ${APIKEY}`,
      },
    }
  },
})

// query
;(async () => {
  const result = await new Promise((resolve, reject) => {
    let result
    client.subscribe(
      {
        query: query,
      },
      {
        next: data => console.log(new Date(), data?.data),
        error: e => {
          console.log('ERROR', e)
          reject()
        },
        complete: () => {
          console.log('Complete')
          resolve(result)
        },
      },
    )
  })
})()
