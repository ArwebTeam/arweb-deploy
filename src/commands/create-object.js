'use strict'

const { flags } = require('../base')

const loader = require('arbase/src/loader')
const validator = require('arbase/src/validator')
const compiler = require('arbase/src/compiler')

const { Command } = require('@oclif/command')

const objectPathRE = /^(@([a-z0-9]+)\/)?([a-z0-9]+)$/i

class CreateObjectCommand extends Command {
  async run () {
    const { flags, args } = this.parse(CreateObjectCommand)

    console.log(args)

    const contents = await loader(args['description-file-path'])
    validator(contents)
    const compiled = compiler({}, contents)

    const [,, ns = null, name] = args['object-path'].match(objectPathRE)

    const obj = compiled.entry[ns][name]

    console.log(obj)
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
  },
  {
    name: 'kv', // name of arg to show in help and reference with args[name]
    required: false, // make the arg required with `required: true`
    description: 'key=value structure', // help description
    multiple: true
  }
]

module.exports = CreateObjectCommand
