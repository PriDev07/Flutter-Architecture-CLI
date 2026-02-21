# create-mobile-arch

A production-ready CLI tool to generate Flutter project architectures with best practices baked in.

## 🚀 Quick Start

Create a new Flutter project with a single command:

```bash
npx create-mobile-arch my_app
```

## ✨ Features

- 🏗️ **Multiple Architecture Patterns**: Clean Architecture & Feature-First
- 📦 **State Management**: Riverpod or Bloc
- 🔌 **Backend Integration**: Firebase or REST API
- 📁 **Well-Structured**: Production-ready folder organization
- 🎨 **Theme Support**: Light & dark mode out of the box
- 🧪 **Testing Ready**: Example tests included
- 📝 **Documentation**: README with architecture details

## 📋 Usage

### Basic Usage

```bash
npx create-mobile-arch <project-name>
```

### With Default Configuration

Skip prompts and use default settings:

```bash
npx create-mobile-arch my_app -y
```

## 🎯 Interactive Configuration

When you run the CLI, you'll be asked to choose:

1. **Architecture Pattern**
   - Clean Architecture (Domain-driven with layers)
   - Feature First (Organized by features)

2. **State Management**
   - Riverpod (Recommended - compile-safe, testable)
   - Bloc (Event-driven state management)

3. **Backend Integration**
   - Firebase (Auth, Firestore, Storage)
   - REST API (Custom backend with HTTP)

4. **Include Examples**
   - Sample code and features

## 📂 Generated Project Structure

```
your_app/
├── lib/
│   ├── core/               # Core functionality
│   │   ├── constants/      # App constants
│   │   ├── theme/          # Theme configuration
│   │   └── utils/          # Utility functions
│   ├── data/               # Data layer
│   │   ├── datasources/    # API, local storage
│   │   ├── models/         # Data models
│   │   └── repositories/   # Repository implementations
│   ├── domain/             # Business logic
│   │   ├── entities/       # Business entities
│   │   ├── repositories/   # Repository interfaces
│   │   └── usecases/       # Business use cases
│   ├── presentation/       # UI layer
│   │   ├── screens/        # App screens
│   │   ├── widgets/        # Reusable widgets
│   │   └── providers/      # State management
│   └── main.dart           # App entry point
├── test/                   # Unit & widget tests
├── pubspec.yaml            # Dependencies
└── README.md               # Project documentation
```

## 🛠️ Requirements

- **Node.js**: >= 14.0.0
- **Flutter**: >= 3.0.0 (for running the generated project)

## 📦 What's Included

The generated Flutter project includes:

### Dependencies
- **flutter_riverpod**: State management
- **get_it**: Dependency injection
- **dio**: HTTP client
- **go_router**: Navigation
- **hive**: Local storage
- **equatable**: Value equality
- **freezed**: Code generation

### Dev Dependencies
- **build_runner**: Code generation
- **flutter_lints**: Linting rules
- **flutter_test**: Testing framework

## 🏃 After Project Generation

Once your project is created:

```bash
cd my_app
flutter run
```

## 📖 Examples

### Create a clean architecture project

```bash
npx create-mobile-arch awesome_app
# Then select: Clean Architecture, Riverpod, REST API
```

### Quick start with defaults

```bash
npx create-mobile-arch quick_app -y
```

## 🔧 Development

### Clone & Setup

```bash
git clone <repository-url>
cd create-mobile-arch
npm install
```

### Test Locally

```bash
npm test
# or
node bin/index.js test_app
```

### Link for Local Development

```bash
npm link
create-mobile-arch my_test_app
```

## 📜 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the documentation

## 🙏 Acknowledgments

Inspired by popular project generators like:
- create-next-app
- create-vite
- create-react-app

---

**Built with ❤️ for the Flutter community**
