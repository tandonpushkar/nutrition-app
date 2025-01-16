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
- Scan QR code with Expo Go app (iOS/Android) to run on a physical device

## Libraries Used

This project utilizes several libraries to enhance functionality and user experience:

- **Expo**: A framework and platform for universal React applications, providing a rich set of APIs and components.
- **Expo Router**: For handling navigation within the app, allowing for a more streamlined routing experience.
- **React Native Reanimated**: For smooth animations and transitions.
- **Expo Linear Gradient**: To create beautiful gradient backgrounds.
- **Expo Camera**: For advanced camera functionalities.
- **Date-fns**: A modern JavaScript date utility library for parsing, formatting, and manipulating dates.
- **Expo Vector Icons**: For using customizable icons throughout the app.

**Note**: No other third-party libraries were used for this project; all libraries are integrated with Expo. Expo was chosen as it is now the default framework by Facebook, offering great community support, ease of use, and features like CI/CD, OTA updates using EAS.

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

## Relevant Notes

- Ensure that your development environment is set up correctly for both iOS and Android.

## Approach and Challenges

In developing this application, I focused on creating a user-friendly interface while ensuring smooth performance. The use of Expo allowed for rapid development and testing, significantly reducing the time required to set up the environment.

Having worked with many animation projects in the past, I was familiar with the concepts. However, implementing some of the header and shadow effects in the nutrition detail screen took additional time to perfect. Overall, there were no significant challenges beyond that.

This project was a great opportunity to apply React Native and Expo skills

## License

This project is licensed under the MIT License - see the LICENSE file for details.
