# To Do List
Developed by: Ing. Javier Toussent Fis  
Email: javiertoussentfis@gmail.com

## Task Features
- Add: It's mandatory to enter a name and select at least one category
- List tasks (Swipeable)
- Mark task as done
- Filter tasks by categories
- Delete: Swipe a task to the left
- Data persistence with AsyncStorage

## Installation Instructions

### Prerequisites
- Node.js (v20.18.2 or newer)
- npm (v10.8.2 or newer)
- Expo CLI

### Installation Steps

1. Clone the repository
```bash
git clone [https://github.com/JavierTF/todo-list-category]
cd todo-list-category
```

2. Install dependencies
```bash
npm install
```

3. Start the Expo development server
```bash
npx expo start --clear
```

4. Run on a device or emulator
   - Scan the QR code with the Expo Go app on your mobile device
   - Press 'a' to run on an Android emulator
   - Press 'i' to run on an iOS simulator

### Download the APK
https://drive.google.com/file/d/13-UqOG-yBWkIu4OMpvP9q93wfT_M600l/view?usp=drive_link

### Building the APK

To create a standalone APK for Android:

1. Configure app.json for your project details

2. Build the APK
```bash
expo build:android -t apk
```

3. Follow the Expo build instructions to download your APK

## Development Notes
This app was built with Expo, a framework for React Native applications that allows for easy development and deployment across platforms.