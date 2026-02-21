const inquirer = require('inquirer');
const chalk = require('chalk');

/**
 * Prompts the user for project configuration choices
 * @returns {Promise<Object>} User's answers
 */
async function promptUserChoices() {
  console.log('\n');
  console.log(chalk.cyan.bold('⚙️  Configure your Flutter project'));
  console.log(chalk.gray('Answer the following questions to customize your project setup:'));
  console.log('\n');

  const questions = [
    {
      type: 'list',
      name: 'architecture',
      message: 'Select your preferred architecture pattern:',
      choices: [
        {
          name: 'Clean Architecture (Domain-driven with layers)',
          value: 'clean',
          short: 'Clean Architecture'
        },
        {
          name: 'Feature First (Organized by features)',
          value: 'feature-first',
          short: 'Feature First'
        }
      ],
      default: 'clean'
    },
    {
      type: 'list',
      name: 'stateManagement',
      message: 'Choose your state management solution:',
      choices: [
        {
          name: 'Riverpod (Recommended - compile-safe, testable)',
          value: 'riverpod',
          short: 'Riverpod'
        },
        {
          name: 'Bloc (Event-driven state management)',
          value: 'bloc',
          short: 'Bloc'
        }
      ],
      default: 'riverpod'
    },
    {
      type: 'list',
      name: 'backend',
      message: 'Select your backend integration:',
      choices: [
        {
          name: 'Firebase (Auth, Firestore, Storage)',
          value: 'firebase',
          short: 'Firebase'
        },
        {
          name: 'REST API (Custom backend with HTTP)',
          value: 'rest',
          short: 'REST API'
        }
      ],
      default: 'rest'
    },
    {
      type: 'confirm',
      name: 'includeExamples',
      message: 'Include example code and sample features?',
      default: true
    }
  ];

  try {
    const answers = await inquirer.prompt(questions);
    return answers;
  } catch (error) {
    if (error.isTtyError) {
      throw new Error('Prompt could not be rendered in this environment');
    } else {
      throw new Error(`Failed to get user input: ${error.message}`);
    }
  }
}

/**
 * Confirms before overwriting an existing directory
 * @param {string} projectName - Name of the existing project
 * @returns {Promise<boolean>} User's confirmation
 */
async function confirmOverwrite(projectName) {
  console.log('\n');
  console.log(chalk.yellow.bold('⚠️  Warning:'), `Directory "${projectName}" already exists!`);
  
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Do you want to overwrite it?',
      default: false
    }
  ]);
  
  return confirm;
}

/**
 * Displays a summary of user choices before generation
 * @param {string} projectName - Project name
 * @param {Object} choices - User's configuration choices
 */
function displayConfigSummary(projectName, choices) {
  console.log('\n');
  console.log(chalk.cyan.bold('📋 Project Configuration Summary:'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('  Project Name:      '), chalk.green(projectName));
  console.log(chalk.white('  Architecture:      '), chalk.green(
    choices.architecture === 'clean' ? 'Clean Architecture' : 'Feature First'
  ));
  console.log(chalk.white('  State Management:  '), chalk.green(
    choices.stateManagement === 'riverpod' ? 'Riverpod' : 'Bloc'
  ));
  console.log(chalk.white('  Backend:           '), chalk.green(
    choices.backend === 'firebase' ? 'Firebase' : 'REST API'
  ));
  console.log(chalk.white('  Include Examples:  '), chalk.green(
    choices.includeExamples ? 'Yes' : 'No'
  ));
  console.log(chalk.gray('─'.repeat(50)));
  console.log('\n');
}

module.exports = {
  promptUserChoices,
  confirmOverwrite,
  displayConfigSummary
};
