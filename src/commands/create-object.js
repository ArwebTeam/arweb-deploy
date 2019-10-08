'use strict'

const { flags } = require('../base')

const loader = require('arbase/src/loader')
const validator = require('arbase/src/validator')
const compiler = require('arbase/src/compiler')

const { Command } = require('@oclif/command')

class CreateObjectCommand extends Command {
  async run () {
    const { flags, args } = this.parse(CreateObjectCommand)
    const contents = await loader(args['description-file-path'])
    validator(contents)
    const compiled = compiler({}, contents)
  }
}

CreateObjectCommand.description = 'Create an arbase object and write it to the permaweb'

CreateObjectCommand.flags = flags

CreateObjectCommand.args = [
  {
    name: 'description-file-path', // name of arg to show in help and reference with args[name]
    required: true, // make the arg required with `required: true`
    description: 'Path to description file, with either node: or json: prefix' // help description
  },
  {
    name: 'object-path', // name of arg to show in help and reference with args[name]
    required: true, // make the arg required with `required: true`
    description: 'Name and namespace of the object' // help description
  }
]

module.exports = CreateObjectCommand
