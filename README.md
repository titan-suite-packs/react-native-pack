# Titan React Native Pack

This repository creates a simple setup for blockchain developers to get started with the AION blockchain and React Native.

## Setup

- `yarn` or `npm install`
- Specify where your AION node is running in `titanrc.js`.
  - If you are running AION on `localhost`, due to how local networking with device emulators works, this will be the IP of the host machine on your local network (e.g. `192.168.x.xxx`).
- `titan unlock` - Unlock the default account
- (optional) `titan compile contracts/SimpleStorage.sol`
- `titan deploy contracts/SimpleStorage.sol`
- `yarn start` or `npm start`
- Run your device emulator, or open the project in the Expo client app (_For physical devices, Android only_)

## Known Limitations

- This pack does not currently work on the iOS Expo Client app on **physical devices** - Most Web3 calls fail (inconsistently).
- Synchronous Web3 calls are not supported on React Native.

```javascript
// doesn't work - react native will yell at you
web3.eth.accounts

// use the asynchronous version instead
web3.eth.getAccounts(callback(error, result){ ... })
```
