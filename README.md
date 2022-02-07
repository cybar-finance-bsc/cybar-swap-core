# Cybar Swap Core

# Local Development

The following assumes the use of `node@>=10`.

## Install Dependencies

`yarn`

## Compile Contracts

`yarn compile`

## Run Tests

`yarn test`

## Local Deployment

First start a local ganache instance, either by using the gui or by using the command line tool. Note that the port in the truffle config has to be set to 7545 if the gui is used and to 8545 if the command line tool is used. Then run 
```
yarn truffle migrate --network localDeployment
```
