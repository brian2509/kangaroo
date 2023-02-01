# App Instructions

## Installation

First, make sure you have the right React Native CLI installed:

```
yarn global remove react-native-cli && yarn global add @react-native-community/cli
```

Next, install other dependencies (Node.js v18.13.0 is preferred):

```
yarn install
```

### Configuration

- Rename ```*.env.sample``` to ```.env```
- Replace the default config values

### iOS only

Install dependencies:

```
(in ios folder)
sudo gem install cocoapods
pod install
```

If this returns an error, try:
```
sudo xcode-select --switch /Applications/Xcode.app
pod install
```

## Starting the app

### run-android

Builds your app and starts it on a connected Android emulator or device.

Usage:
```
yarn android
```

### run-ios

Builds your app and starts it on iOS simulator.

Usage:
```
(in main folder)
yarn ios
```

### start

Starts the server that communicates with connected devices.

Usage:
```
yarn start
```