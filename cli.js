#!/usr/bin/env node

const { exec } = require("shelljs");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const templatesDir = path.join(__dirname, "templates");

// Function to prompt user for project type
function promptForProjectType() {
  return inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Choose a project template:",
      choices: fs.readdirSync(templatesDir),
    },
    {
      type: "input",
      name: "projectName",
      message: "Enter project name:",
      validate: function (input) {
        // Validate if directory with the same name already exists
        const projectPath = path.join(process.cwd(), input);
        if (fs.existsSync(projectPath)) {
          return "Directory already exists. Please choose a different project name.";
        }
        return true;
      },
    },
  ]);
}

// Function to copy template directory to destination
function copyTemplate(templateName, projectName) {
  const templatePath = path.join(templatesDir, templateName);
  const destinationPath = path.join(process.cwd(), projectName);
  exec(`cp -r ${templatePath} ${destinationPath}`);

  // Read and modify package.json
  const packageJsonPath = path.join(destinationPath, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
    const packageJsonData = JSON.parse(packageJsonContent);
    packageJsonData.name = projectName; // Set project name as package name
    const modifiedPackageJson = JSON.stringify(packageJsonData, null, 2);
    fs.writeFileSync(packageJsonPath, modifiedPackageJson, "utf8");
  }
}

// Main function to start CLI
async function main() {
  try {
    const { template, projectName } = await promptForProjectType();
    copyTemplate(template, projectName);
    console.log(`Project '${projectName}' created successfully.`);
  } catch (error) {
    console.error("Error creating project:", error);
  }
}

main();
