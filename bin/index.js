#!/usr/bin/env node

/**
 * create-mobile-arch CLI
 * A production-ready CLI tool to generate Flutter project architectures
 * 
 * Usage: npx create-mobile-arch <project-name>
 */

const { program } = require('commander');
const chalk = require('chalk');
const path = require('path');

const { promptUserChoices, confirmOverwrite, displayConfigSummary } = require('../src/prompts');
const { generateProject } = require('../src/generator');
const { validateProjectName, directoryExists, printError } = require('../src/utils');

// Package information
const packageJson = require('../package.json');

/**
 * Main CLI function
 */
async function main() {
  // Display banner
  console.log('\n');
  console.log(chalk.cyan.bold('╔════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║   ') + chalk.white.bold('Create Mobile Architecture') + chalk.cyan.bold('      ║'));
  console.log(chalk.cyan.bold('║   ') + chalk.gray('Flutter Project Generator') + chalk.cyan.bold('          ║'));
  console.log(chalk.cyan.bold('╚════════════════════════════════════════╝'));
  console.log('\n');

  // Configure CLI
  program
    .name('create-mobile-arch')
    .description('Generate a production-ready Flutter project with Clean Architecture or Feature-First pattern')
    .version(packageJson.version, '-v, --version', 'Output the current version')
    .argument('[project-name]', 'Name of your Flutter project')
    .option('-y, --yes', 'Skip prompts and use default configuration')
    .helpOption('-h, --help', 'Display help for command')
    .addHelpText('after', `
Example:
  $ npx create-mobile-arch my_app
  $ npx create-mobile-arch my_awesome_app -y

For more information, visit: https://github.com/yourusername/create-mobile-arch
    `)
    .parse(process.argv);

  const args = program.args;
  const options = program.opts();

  // Get project name from arguments
  let projectName = args[0];

  // If no project name provided, show error
  if (!projectName) {
    printError('Project name is required');
    console.log(chalk.white('Usage:'), chalk.cyan('npx create-mobile-arch <project-name>'));
    console.log('\n');
    console.log(chalk.gray('Example:'), chalk.white('npx create-mobile-arch my_app'));
    console.log('\n');
    process.exit(1);
  }

  // Validate project name
  const validation = validateProjectName(projectName);
  if (!validation.valid) {
    printError(validation.error);
    console.log(chalk.gray('Examples of valid names:'), chalk.white('my_app, flutter_project, awesome_app_2024'));
    console.log('\n');
    process.exit(1);
  }

  try {
    // Check if directory already exists
    const projectPath = path.join(process.cwd(), projectName);
    const exists = await directoryExists(projectPath);

    if (exists) {
      // Ask for confirmation to overwrite
      const shouldOverwrite = await confirmOverwrite(projectName);
      
      if (!shouldOverwrite) {
        console.log('\n');
        console.log(chalk.yellow('Operation cancelled'));
        console.log('\n');
        process.exit(0);
      }
      
      // Remove existing directory
      const fs = require('fs-extra');
      await fs.remove(projectPath);
    }

    // Get user choices (or use defaults if -y flag)
    let userChoices;
    
    if (options.yes) {
      // Use default configuration
      userChoices = {
        architecture: 'clean',
        stateManagement: 'riverpod',
        backend: 'rest',
        includeExamples: true
      };
      console.log(chalk.gray('Using default configuration...'));
    } else {
      // Prompt user for configuration
      userChoices = await promptUserChoices();
    }

    // Display configuration summary
    displayConfigSummary(projectName, userChoices);

    // Generate the project
    console.log(chalk.cyan.bold('🚀 Generating your Flutter project...'));
    console.log('\n');
    
    await generateProject(projectName, userChoices);

  } catch (error) {
    // Handle errors gracefully
    printError(error.message);
    
    if (error.stack && process.env.DEBUG) {
      console.log(chalk.gray('Stack trace:'));
      console.log(chalk.gray(error.stack));
    }
    
    console.log(chalk.gray('If this issue persists, please report it at:'));
    console.log(chalk.cyan('https://github.com/yourusername/create-mobile-arch/issues'));
    console.log('\n');
    
    process.exit(1);
  }
}

// Run the CLI
main().catch(error => {
  printError('Unexpected error occurred');
  console.error(error);
  process.exit(1);
});
