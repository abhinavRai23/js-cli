const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const ncp = require("ncp").ncp;
const inquirer = require("inquirer");

const questions = [
  {
    type: "input",
    name: "projectName",
    message: "Enter the name of the new project:",
  },
  {
    type: "list",
    name: "projectType",
    message: "Select the type of project:",
    choices: ["vanilla-js", "react"],
  },
];

inquirer
  .prompt(questions)
  .then((answers) => {
    const { projectName, projectType } = answers;
    const projectPath = path.resolve(process.cwd(), `src/${projectName}`);
    const templatePath = path.resolve(__dirname, "templates", projectType);

    console.log(
      `Creating a new ${projectType} project named ${projectName}...`
    );

    // Function to create vanilla JS project
    function createVanillaJsProject(name) {
      execSync(`mkdir -p ${projectPath} && cd ${projectPath} && npm init -y`, {
        stdio: "inherit",
      });

      // Copy template files
      ncp(templatePath, projectPath, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log("Template files copied successfully.");
      });
    }

    // Function to create React project
    function createReactProject(name) {
      execSync(`mkdir -p ${projectPath}`, { stdio: "inherit" });
      process.chdir(projectPath);

      // Copy template files
      ncp(templatePath, projectPath, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log("Template files copied successfully.");

        // Add development script to package.json
        const packageJsonPath = path.join(projectPath, "package.json");

        // Read and modify package.json
        if (fs.existsSync(packageJsonPath)) {
          const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
          const packageJsonData = JSON.parse(packageJsonContent);
          packageJsonData.name = projectName; // Set project name as package name
          const modifiedPackageJson = JSON.stringify(packageJsonData, null, 2);
          fs.writeFileSync(packageJsonPath, modifiedPackageJson, "utf8");
        }

        // Modify scripts in package.json
        const packageJson = require(packageJsonPath);
        packageJson.scripts = {
          ...packageJson.scripts,
          start: "webpack serve --mode development --open",
        };

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log("Development script added to package.json.");
      });
    }

    if (projectType === "vanilla-js") {
      createVanillaJsProject(projectName);
    } else if (projectType === "react") {
      createReactProject(projectName);
    }

    console.log(`Successfully created ${projectName}.`);
  })
  .catch((error) => {
    console.error("Error during project creation:", error);
  });
