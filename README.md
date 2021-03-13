## Developing

Get yarn with `npm i -g yarn` and do:

```
cd frontend
yarn
yarn start
```

```
cd server
yarn
yarn start
```

## Building

Same as developing but install `npm i -g pm2` and:

-   For frontend, run `yarn build` once
-   For server, run `pm2 start ecosystem.config.js`
