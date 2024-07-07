# js-cli

js based cli to create starter projects

To use the this first install dependecies

```
npm i
```

Two possible ways:-

### 1. npm scripts

To use npm-srcipts to install subprojects locally to monorepo.

there will be a script in root package.json, subproject will be installed using

```
npm run create-subproject
```

Once its done. navigate to the subproject and run

```
npm i && npm start
```

This should be used if we have some repeated project specific needs

### 2. Global cli script

Setup generic project using global-cli to create plug and play projects.

to install package globally

```
npm link

// to varify if package installed globally
npm ls -g

//incase permission related problem comes with cli
chmod +x cli.js
```
