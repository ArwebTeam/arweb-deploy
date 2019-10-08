'use strict'

const { flags } = require('../base')

const { Command } = require('@oclif/command')

class DeployAssetsCommand extends Command {
  async run () {
    const { flags, args } = this.parse(DeployAssetsCommand)
  }
}

DeployAssetsCommand.description = 'Deploys assets to the permaweb'

DeployAssetsCommand.flags = flags

DeployAssetsCommand.args = [
  {
    name: 'path', // name of arg to show in help and reference with args[name]
    required: true, // make the arg required with `required: true`
    description: 'Path to assets' // help description
  },
  {
    name: 'app-id', // name of arg to show in help and reference with args[name]
    required: true, // make the arg required with `required: true`
    description: 'App ID to update' // help description
  }
]

module.exports = DeployAssetsCommand
