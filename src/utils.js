const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Validates the project name according to Flutter naming conventions
 * @param {string} name - Project name to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
function validateProjectName(name) {
  if (!name) {
    return {
      valid: false,
      error: 'Project name is required'
    };
  }

  // Flutter project names must be valid Dart package names
  // Must be lowercase, can contain underscores and numbers, but not start with a number
  const validNamePattern = /^[a-z][a-z0-9_]*$/;
  
  if (!validNamePattern.test(name)) {
    return {
      valid: false,
      error: 'Project name must start with a lowercase letter and can only contain lowercase letters, numbers, and underscores'
    };
  }

  // Reserved Dart keywords
  const reservedWords = [
    'abstract', 'as', 'assert', 'async', 'await', 'break', 'case', 'catch',
    'class', 'const', 'continue', 'default', 'do', 'else', 'enum', 'export',
    'extends', 'false', 'final', 'finally', 'for', 'if', 'import', 'in',
    'is', 'library', 'new', 'null', 'operator', 'part', 'return', 'super',
    'switch', 'this', 'throw', 'true', 'try', 'var', 'void', 'while', 'with'
  ];

  if (reservedWords.includes(name)) {
    return {
      valid: false,
      error: `Project name "${name}" is a reserved Dart keyword`
    };
  }

  return { valid: true };
}

/**
 * Checks if a directory exists
 * @param {string} dirPath - Directory path to check
 * @returns {boolean}
 */
async function directoryExists(dirPath) {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Converts a string to PascalCase (for app names)
 * @param {string} str - String to convert
 * @returns {string}
 */
function toPascalCase(str) {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Converts a string to snake_case
 * @param {string} str - String to convert
 * @returns {string}
 */
function toSnakeCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Recursively copies directory and replaces placeholders in file contents
 * @param {string} srcDir - Source directory
 * @param {string} destDir - Destination directory
 * @param {Object} replacements - Key-value pairs for placeholder replacement
 */
async function copyAndReplace(srcDir, destDir, replacements) {
  try {
    // Ensure destination directory exists
    await fs.ensureDir(destDir);
    
    // Read all items in source directory
    const items = await fs.readdir(srcDir);
    
    for (const item of items) {
      const srcPath = path.join(srcDir, item);
      const destPath = path.join(destDir, item);
      
      const stats = await fs.stat(srcPath);
      
      if (stats.isDirectory()) {
        // Recursively copy subdirectories
        await copyAndReplace(srcPath, destPath, replacements);
      } else if (stats.isFile()) {
        // Read file content
        let content = await fs.readFile(srcPath, 'utf8');
        
        // Replace all placeholders
        Object.keys(replacements).forEach(placeholder => {
          const regex = new RegExp(placeholder, 'g');
          content = content.replace(regex, replacements[placeholder]);
        });
        
        // Write to destination
        await fs.writeFile(destPath, content, 'utf8');
      }
    }
  } catch (error) {
    throw new Error(`Failed to copy template: ${error.message}`);
  }
}

/**
 * Checks if Flutter is installed on the system
 * @returns {boolean}
 */
async function isFlutterInstalled() {
  const { exec } = require('child_process');
  const util = require('util');
  const execPromise = util.promisify(exec);
  
  try {
    await execPromise('flutter --version');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Prints a success message with next steps
 * @param {string} projectName - Name of the created project
 * @param {string} projectPath - Path to the project
 */
function printSuccessMessage(projectName, projectPath) {
  console.log('\n');
  console.log(chalk.green.bold('✅ Success!'), `Your Flutter project "${projectName}" has been created!`);
  console.log('\n');
  console.log(chalk.cyan('📁 Project location:'), chalk.white(projectPath));
  console.log('\n');
  console.log(chalk.yellow.bold('Next steps:'));
  console.log(chalk.white('  1.'), `cd ${projectName}`);
  console.log(chalk.white('  2.'), 'Open the project in your IDE (VS Code, Android Studio, etc.)');
  console.log(chalk.white('  3.'), 'Run:', chalk.cyan('flutter run'));
  console.log('\n');
  console.log(chalk.gray('💡 Tip: Check the README.md file in your project for architecture details'));
  console.log('\n');
}

/**
 * Prints an error message
 * @param {string} message - Error message
 */
function printError(message) {
  console.log('\n');
  console.log(chalk.red.bold('❌ Error:'), chalk.white(message));
  console.log('\n');
}

module.exports = {
  validateProjectName,
  directoryExists,
  toPascalCase,
  toSnakeCase,
  copyAndReplace,
  isFlutterInstalled,
  printSuccessMessage,
  printError
};
