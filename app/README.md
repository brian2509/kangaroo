# App Instructions

## Installation

First, make sure you have the right React Native CLI installed:

```
npm un -g react-native-cli && npm i -g @react-native-community/cli
```

Next, install other dependencies:

```
npm install
```

### Configuration

-   Rename `*.env.sample` to `.env`
-   Replace the default config values
-   Run `react-native link react-native-vector-icons` to import icons

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
npm run android
```

### run-ios

Builds your app and starts it on iOS simulator.

Usage:

```
(in main folder)
npm run ios
```

### start

Starts the server that communicates with connected devices.

Usage:

```
npm start
```
