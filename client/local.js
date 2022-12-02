const {createClient} = require('graphql-ws')
const {WebSocket} = require('ws')
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const query = 'subscription { changes { time rand}} '

const client = createClient({
  webSocketImpl: WebSocket,
  url: 'ws://localhost:9000/stepzen-subscriptions/api/subscription/__graphql',
  connectionParams: () => {
    return {
      headers: {Authorization: `apikey ${process.env.APIKEY}`},
    }
  },
})

console.log('CLIENT')

// query
;(async () => {
  const result = await new Promise((resolve, reject) => {
    let result
    client.subscribe(
      {query: query},
      {
        next: data => console.log(new Date(), data?.data?.changes),
        error: e => {
          console.log('ERROR', e)
          reject()
        },
        complete: () => {
          console.log('COMPLETE')
          resolve(result)
        },
      },
    )
  })
})()
