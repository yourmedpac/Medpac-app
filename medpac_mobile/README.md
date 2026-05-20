# Medpac Mobile Application - Flutter

This is the premium mobile application for Medpac Health OS, built using Flutter and Dart. It features a complete custom dark theme, a state-of-the-art bottom navigation shell, and beautifully styled components matching the Medpac Health OS design system.

## Project Structure

- `lib/main.dart` - Application entry point and bottom navigation shell.
- `lib/screens/` - Complete UI layouts for the application:
  - `home_screen.dart` - Vitals dashboard, daily health score summary, and upcoming consultations.
  - `ai_assistant_screen.dart` - Chat bot interface with PDF document attachment triggers and responsive suggestions.
  - `medicines_screen.dart` - Prescriptions logger, checkboxes, and warning indicators for low pills.
  - `records_screen.dart` - PDF uploads grid and parsed medical report summaries viewer.
  - `profile_screen.dart` - Patient Medical ID, Emergency Card, insurance, and device sync details.

---

## Setup & Running Guide

To run this mobile app, you need to set up the Flutter SDK on your computer.

### Step 1: Install Flutter SDK
1. Download the Flutter SDK for Windows from the official site:
   [https://docs.flutter.dev/get-started/install/windows/mobile-dev](https://docs.flutter.dev/get-started/install/windows/mobile-dev)
2. Extract the ZIP file and place it in a path (e.g. `C:\src\flutter`).
3. Add the `flutter/bin` directory to your system environment variables `PATH`.
4. Open a terminal and run `flutter doctor` to verify the installation requirements.

### Step 2: Set up an Emulator or Physical Device
- **Android:** Install Android Studio, download the Android SDK, and create a Virtual Device (AVD) from the Virtual Device Manager.
- **iOS (requires macOS):** Install Xcode and open the iOS Simulator.
- **Chrome / Web:** You can also run the app directly in Google Chrome.

### Step 3: Get Dependencies and Run the App
Open a terminal inside this directory (`medpac_mobile`) and run:

```bash
# Fetch and install Dart/Flutter dependencies
flutter pub get

# List connected devices
flutter devices

# Run the app in development mode on your target device
flutter run
```
