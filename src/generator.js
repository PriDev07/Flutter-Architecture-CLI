const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const { exec } = require('child_process');
const util = require('util');

const {
  copyAndReplace,
  toPascalCase,
  toSnakeCase,
  isFlutterInstalled,
  printSuccessMessage,
  printError
} = require('./utils');

const execPromise = util.promisify(exec);

/**
 * Main function to generate a Flutter project
 * This is where the template copying happens:
 * - Templates are stored in /templates/flutter-clean directory
 * - The copyAndReplace utility function recursively copies all files
 * - During copy, it replaces placeholders like __APP_NAME__ with actual values
 * 
 * @param {string} projectName - Name of the project
 * @param {Object} options - Project configuration options
 * @returns {Promise<void>}
 */
async function generateProject(projectName, options) {
  const projectPath = path.join(process.cwd(), projectName);
  let spinner;

  try {
    // Step 1: Create project directory
    spinner = ora({
      text: 'Creating project directory...',
      color: 'cyan'
    }).start();
    
    await fs.ensureDir(projectPath);
    spinner.succeed(chalk.green('Project directory created'));

    // Step 2: Determine template path based on architecture choice
    const templateName = options.architecture === 'clean' ? 'flutter-clean' : 'flutter-clean';
    const templatePath = path.join(__dirname, '..', 'templates', templateName);

    // Check if template exists
    const templateExists = await fs.pathExists(templatePath);
    if (!templateExists) {
      throw new Error(`Template not found at ${templatePath}`);
    }

    // Step 3: Copy template files and replace placeholders
    // THIS IS WHERE TEMPLATE COPYING HAPPENS
    spinner = ora({
      text: 'Copying template files...',
      color: 'cyan'
    }).start();

    const replacements = {
      '__APP_NAME__': projectName,
      '__APP_NAME_PASCAL__': toPascalCase(projectName),
      '__APP_NAME_SNAKE__': toSnakeCase(projectName),
      '__STATE_MANAGEMENT__': options.stateManagement,
      '__BACKEND_TYPE__': options.backend
    };

    // Copy all files from template directory and replace placeholders
    await copyAndReplace(templatePath, projectPath, replacements);
    spinner.succeed(chalk.green('Template files copied'));

    // Step 4: Generate README with configuration details
    spinner = ora({
      text: 'Generating project documentation...',
      color: 'cyan'
    }).start();
    
    await generateReadme(projectPath, projectName, options);
    spinner.succeed(chalk.green('Documentation generated'));

    // Step 5: Check if Flutter is installed
    const flutterInstalled = await isFlutterInstalled();
    
    if (!flutterInstalled) {
      spinner = ora().warn(chalk.yellow('Flutter not found. Skipping flutter pub get'));
      console.log(chalk.yellow('  Please install Flutter and run "flutter pub get" manually'));
    } else {
      // Step 6: Run flutter pub get
      spinner = ora({
        text: 'Running flutter pub get...',
        color: 'cyan'
      }).start();

      try {
        await execPromise('flutter pub get', {
          cwd: projectPath,
          // Set timeout to 2 minutes
          timeout: 120000
        });
        spinner.succeed(chalk.green('Dependencies installed'));
      } catch (error) {
        spinner.warn(chalk.yellow('Failed to install dependencies'));
        console.log(chalk.gray(`  You can run "flutter pub get" manually in the project directory`));
      }
    }

    // Step 7: Display success message
    printSuccessMessage(projectName, projectPath);

  } catch (error) {
    if (spinner) {
      spinner.fail(chalk.red('Project generation failed'));
    }
    throw error;
  }
}

/**
 * Generates a comprehensive README.md file for the project
 * @param {string} projectPath - Path to the project directory
 * @param {string} projectName - Name of the project
 * @param {Object} options - Project configuration options
 */
async function generateReadme(projectPath, projectName, options) {
  const archName = options.architecture === 'clean' ? 'Clean Architecture' : 'Feature-First Architecture';
  const stateMgmt = options.stateManagement === 'riverpod' ? 'Riverpod' : 'Bloc';
  const backend = options.backend === 'firebase' ? 'Firebase' : 'REST API';

  const readmeContent = `# ${toPascalCase(projectName)}

A Flutter project built with **${archName}** pattern.

## 📱 Project Overview

This project was generated using \`create-mobile-arch\` CLI tool.

### Architecture & Tech Stack

- **Architecture Pattern:** ${archName}
- **State Management:** ${stateMgmt}
- **Backend Integration:** ${backend}

## 🏗️ Project Structure

\`\`\`
lib/
├── core/              # Core functionality (constants, themes, utils)
├── data/              # Data layer (repositories, data sources, models)
├── domain/            # Business logic (entities, use cases, interfaces)
├── presentation/      # UI layer (screens, widgets, ${options.stateManagement})
└── main.dart          # Application entry point
\`\`\`

## 🚀 Getting Started

### Prerequisites

- Flutter SDK (>=3.0.0)
- Dart SDK (>=3.0.0)
${options.backend === 'firebase' ? '- Firebase project setup\n' : ''}
### Installation

1. Get dependencies:
   \`\`\`bash
   flutter pub get
   \`\`\`

2. Run the app:
   \`\`\`bash
   flutter run
   \`\`\`

## 📦 Dependencies

Check \`pubspec.yaml\` for the complete list of dependencies.

### Key Packages

- **${stateMgmt}:** State management
${options.backend === 'firebase' 
  ? '- **Firebase Core, Auth, Firestore:** Backend services\n' 
  : '- **HTTP/Dio:** API communication\n'}
- **Get It:** Dependency injection

## 🧪 Testing

Run tests:
\`\`\`bash
flutter test
\`\`\`

## 🏛️ Architecture Details

### ${archName}

${options.architecture === 'clean' 
  ? `This project follows Clean Architecture principles with three main layers:

1. **Presentation Layer:** UI components, state management
2. **Domain Layer:** Business logic, use cases, entities
3. **Data Layer:** API calls, local storage, repositories

**Data Flow:** UI → State Management → Use Cases → Repository → Data Source`
  : `This project follows Feature-First architecture:

- Each feature is self-contained in its own directory
- Features contain their own models, widgets, and logic
- Shared code is placed in common/core directories`}

## 📝 License

This project is licensed under the MIT License.

---

Generated with ❤️ by create-mobile-arch
`;

  await fs.writeFile(
    path.join(projectPath, 'README.md'),
    readmeContent,
    'utf8'
  );
}

module.exports = {
  generateProject
};
