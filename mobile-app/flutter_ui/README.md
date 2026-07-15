# Traffic Fine Payment System - Flutter UI

This is the mobile UI application for the Sri Lanka Police Traffic Fine Payment System built with Flutter.

## Project Structure

```
lib/
├── main.dart              # App entry point
├── screens/               # UI screens (HomeScreen, PaymentScreen, etc.)
├── widgets/               # Reusable UI widgets/components
├── models/                # Data models and entities
└── services/              # API and service calls

assets/
├── images/                # Images, logos, icons
└── fonts/                 # Custom fonts (if any)

test/                       # Unit and widget tests
```

## Getting Started

### Prerequisites
- Flutter SDK (>=2.19.0)
- Dart SDK
- Android Studio / Xcode (for emulator)

### Installation

1. Navigate to the project directory:
```bash
cd flutter_ui
```

2. Install dependencies:
```bash
flutter pub get
```

3. Run the app:
```bash
flutter run
```

4. Run tests:
```bash
flutter test
```

## Technologies Used
- **Flutter**: UI framework
- **Provider**: State management
- **HTTP**: API calls
- **Intl**: Internationalization
- **Material Design 3**: UI components

## Features to Implement
- [ ] Home screen with fine lookup
- [ ] Fine details display
- [ ] Payment gateway integration
- [ ] User authentication (if required)
- [ ] Payment history
- [ ] Receipt generation
- [ ] Error handling and validations
- [ ] Dark mode support

## API Integration
- Backend Auth Service: [Auth service URL]
- Backend Payment Service: [Payment service URL]

## Build Instructions

### Debug Build
```bash
flutter build apk --debug
```

### Release Build
```bash
flutter build apk --release
flutter build appbundle --release
```

## Project Status
- [x] Project structure created
- [ ] Initial screens designed
- [ ] API integration
- [ ] Payment processing
- [ ] Testing

## Contributing
Follow Flutter best practices and material design guidelines.

## License
[Your License Here]
