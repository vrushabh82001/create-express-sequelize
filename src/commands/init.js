const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const fileUtils = require('../utils/fileUtils');

async function init() {
    const templatesDir = path.join(__dirname, '../templates');
    const templates = fs.readdirSync(templatesDir).filter(file => fs.statSync(path.join(templatesDir, file)).isDirectory());

    // Prompt user to select a template
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'template',
            message: 'Select a template:',
            choices: templates
        }
    ]);

    const selectedTemplate = answers.template;
    const targetDir = process.cwd();
    const templateDir = path.join(templatesDir, selectedTemplate);

    // Copy selected template files to the target directory
    fileUtils.copyFolderSync(templateDir, targetDir);

    console.log(`Project initialized with ${selectedTemplate} template successfully!`);
}

module.exports = init;
