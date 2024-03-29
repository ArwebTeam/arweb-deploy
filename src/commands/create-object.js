'use strict'

const generator = require('arbase')
const Client = require('arbase/src/client')
const { decodeAndValidate, decodeTxData } = require('arbase/src/client/process')

const { cli } = require('cli-ux')
const { flags, arweave, confirm } = require('../base')
const { Command } = require('@oclif/command')

const objectPathRE = /^(@([a-z0-9]+)\/)?([a-z0-9]+)$/i
const kvRE = /^([a-z0-9]+)=(.+)$/i

const convert = {
  number: v => parseInt(v, 10),
  string: v => v,
  file: v => v
}

function normalizeValue (attr, value) {
  const { type } = attr

  if (type.native) {
    return convert[type.name](value)
  }

  throw new Error('Non-natives not supported yet')
}

const chalk = require('chalk')
const { inspect } = require('util')
const Joi = require('@hapi/joi')

class CreateObjectCommand extends Command {
  async run () {
    const { flags, args } = this.parse(CreateObjectCommand)
    const { write } = Client(arweave)

    const code = await generator(args['description-file-path'], { signoff: 'eval' })
    const compiled = eval(code) // eslint-disable-line no-eval

    const [,, ns = null, name] = args['object-path'].match(objectPathRE)

    const entry = compiled.entry[ns][name]
    const val = {}

    args.kv.forEach(pair => {
      const [, key, value] = pair.match(kvRE)

      const attr = entry.attribute[key]

      if (!attr) {
        console.error(`${key} is not part of ${args['object-path']}!`)
        process.exit(2)
      }

      val[key] = normalizeValue(attr, value)
    })

    arweave.jwk = flags['key-file']
    const tx = await write.entryCreate(entry, val)

    console.log('')
    console.log(`${chalk.bold('Data')}:`)
    console.log('  ' + inspect(await decodeAndValidate(entry, decodeTxData(tx)), { depth: 2, colors: true }).split('\n').join('\n  '))
    console.log(`${chalk.bold('Price')}: ${arweave.ar.winstonToAr(tx.reward)} AR`)
    console.log('')

    if (!flags.yes) {
      await confirm()
    }

    cli.action.start('publishing...')

    await arweave.transactions.sign(tx, flags['key-file'])
    const response = await arweave.transactions.post(tx)

    this.log('Published as %s: %o', tx.id, response.data)

    cli.action.stop('done')
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
