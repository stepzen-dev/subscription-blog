# subscription-blog
A simple example of subscriptions in StepZen. Any query in StepZen can be converted into a subscription. To give an example:
```graphql
type Query {
    foo: Foo
    @rest (endpoint: "...")
}
type Subscription {
    fooSub: Foo @materializer (query:"foo")
}
```
That's it! `foo` can be a `@rest` query, it could be `@dbquery`, it could be a federated `@graphql` query, it could be an `@sequence`. Any way you construct your queries, each and everyone of them can be converted into a subscription! (Underneath the covers, StepZen does long polling to determine what has changed, and more mechanisms are coming, but you can start using it right now, and we will continue to optimize it.)

You can run this sample either locally or using the managed StepZen stepzen.net service.

## Local version

### Steps
1. Download this repo and `cd subscription-blog/graphql`. 
2. If you do not have `stepzen` installed, then `npm install -g stepzen`.
3. `cd graphql && stepzen service start && stepzen login --config ~/.stepzen/stepzen-config.local.yaml`--this starts a local docker container running all of StepZen's services.
4. `stepzen deploy` deploys the `graphql` schema in `index.graphql` to StepZen (on your local machine) and the endpoint is `http://localhost:9000/api/subscription/__graphql`
5. Now we will have a client that makes subscription requests on `web sockets` to this endpoint. For this, `cd ../client && npm install`.
6. Setup .env; `echo 'APIKEY='$(stepzen whoami --apikey) > .env`  (`stepzen whoami --apikey` retrieves your admin key, it should look something like: `graphql::local.net...`)
7. `node client.js` and see the magic.  You will see the time the subscription ran and a random number reflected on your console.

## StepZen stepzen.net service
### Steps
1. Download this repo and `cd subscription-blog/graphql`. 
2. Make sure you've registered for an account and setup your cli.  [Getting Started](https://stepzen.com/getting-started) has instructions on how to do this.
3. `cd graphql && stepzen deploy` deploys the `graphql` schema in `index.graphql` to StepZen (on your local machine) and the endpoint is `http://localhost:9000/api/subscription/__graphql`
5. Now we will have a client that makes subscription requests on `web sockets` to this endpoint. For this, `cd ../client && npm install`.
6. Setup .env; replace `<YOUR_ACCOUNT>` with your account name in the following and run `(echo 'APIKEY='$(stepzen whoami --apikey)  ; echo STEPZEN_ACCOUNT=<YOUR_ACCOUNT>) > .env` 
7. `node client.js` and see the magic.  You will see the time the subscription ran and a random number reflected on your console.


## How this all works
The subscription is materialized against an internal endpoint `stepzen:empty` with content provided via a JSONata transform.  StepZen does long polling and pushes back to the client whenever a new value is found. 

Because any `type Query` can be converted to `type Subscription`, you can set up subscription against databases, graphql endpoints, or any combination thereof. Try them for yourself.
