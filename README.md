arweb-deploy
============

Arweb deploy is a tool to help you with deploying your arweb project

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/arweb-deploy.svg)](https://npmjs.org/package/arweb-deploy)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/ArwebTeam/arweb-deploy?branch=master&svg=true)](https://ci.appveyor.com/project/ArwebTeam/arweb-deploy/branch/master)
[![Downloads/week](https://img.shields.io/npm/dw/arweb-deploy.svg)](https://npmjs.org/package/arweb-deploy)
[![License](https://img.shields.io/npm/l/arweb-deploy.svg)](https://github.com/ArwebTeam/arweb-deploy/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g arweb-deploy
$ arweb-deploy COMMAND
running command...
$ arweb-deploy (-v|--version|version)
arweb-deploy/0.1.1 linux-x64 node-v10.16.3
$ arweb-deploy --help [COMMAND]
USAGE
  $ arweb-deploy COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`arweb-deploy create-object DESCRIPTION-FILE-PATH OBJECT-PATH [KV]`](#arweb-deploy-create-object-description-file-path-object-path-kv)
* [`arweb-deploy deploy-assets PATH APP-ID`](#arweb-deploy-deploy-assets-path-app-id)
* [`arweb-deploy help [COMMAND]`](#arweb-deploy-help-command)

## `arweb-deploy create-object DESCRIPTION-FILE-PATH OBJECT-PATH [KV]`

Create an arbase object and write it to the permaweb

```
USAGE
  $ arweb-deploy create-object DESCRIPTION-FILE-PATH OBJECT-PATH [KV]

ARGUMENTS
  DESCRIPTION-FILE-PATH  Path to description file, with either node: or json: prefix
  OBJECT-PATH            Name and namespace of the object
  KV                     key=value structure

OPTIONS
  -k, --key-file=key-file  (required) Path to arweave key-file
  -y, --yes
```

_See code: [src/commands/create-object.js](https://github.com/ArwebTeam/arweb-deploy/blob/v0.1.1/src/commands/create-object.js)_

## `arweb-deploy deploy-assets PATH APP-ID`

Deploys assets to the permaweb

```
USAGE
  $ arweb-deploy deploy-assets PATH APP-ID

ARGUMENTS
  PATH    Path to assets
  APP-ID  App ID to update

OPTIONS
  -k, --key-file=key-file  (required) Path to arweave key-file
  -y, --yes
```

_See code: [src/commands/deploy-assets.js](https://github.com/ArwebTeam/arweb-deploy/blob/v0.1.1/src/commands/deploy-assets.js)_

## `arweb-deploy help [COMMAND]`

display help for arweb-deploy

```
USAGE
  $ arweb-deploy help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_
<!-- commandsstop -->
