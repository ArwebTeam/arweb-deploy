'use strict'

const { Command, flags } = require('@oclif/command')

class DeployAssetsCommand extends Command {
  async run () {
    const { flags } = this.parse(DeployAssetsCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/maciej/Projekte/arweave/arweb-deploy/src/commands/deploy-assets.js`)
  }
}

DeployAssetsCommand.description = 'Deploys the assets'

DeployAssetsCommand.flags = {
  name: flags.string({ char: 'n', description: 'name to print' })
}

module.exports = DeployAssetsCommand
