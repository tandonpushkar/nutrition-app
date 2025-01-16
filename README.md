# Mobile App Project

A React Native mobile application built with Expo.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development)
- [Android Studio](https://developer.android.com/studio) (for Android development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### iOS

Make sure you have Xcode installed, then run:
```bash
npm run ios
```
This will open the app in the iOS simulator.

### Android

Ensure you have Android Studio installed and an Android emulator set up, then run:
```bash
npm run android
```
Or simply press `a` when the Metro bundler is running.

### Development Mode

To start the development server:
```bash
npx expo start
```

This will show a QR code and several options:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan QR code with Expo Go app (iOS/Android) to run on physical device

## Troubleshooting

If you encounter any issues:

1. Clear the npm cache:
```bash
npm cache clean --force
```

2. Reset Metro bundler:
```bash
npx expo start --clear
```

3. Make sure all iOS dependencies are installed:
```bash
cd ios && pod install && cd ..
```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
