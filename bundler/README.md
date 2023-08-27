### Neo Relayer

Implementing a relayer for the NEO blockchain using NestJS.

For basic implementaion we have

- On server start use one config json file to check the relayer funds
- Have end point to fetch gas price and store it locally somewhere
- Have endpoint which will add the transaction and send it on chain return the hash of the tx

TODO:

- On start fund the relayers with a master account if not funded
- Create a cron job to check the gas price and update it
- Use redis to store the gasPrices
- Use redis to store the transactions
- Create a cron job to check the transactions and send them on chain

Gas Price

- Network Fee -
- System Fee -


#### Deploy
```
docker build -t bundler .
docker run -p 3000:3000 bundler
```