'use strict'

/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

const { flags } = require('@oclif/command')
const { cli } = require('cli-ux')

const Arweave = require('arweave/node')
const arweave = Arweave.init({ protocol: 'https', host: 'arweave.net' })

async function confirm () {
  while (true) {
    const ans = await cli.prompt('Continue [y/N]?')
    if (ans.match(/^ye?s?$/mi)) {
      break
    } else if (ans.match(/^no?$/mi)) {
      process.exit(0)
    }
  }
}

module.exports = {
  flags: {
    'key-file': flags.string({
      char: 'k',
      description: 'Path to arweave key-file',
      required: true,
      parse: path => require(path),
      env: 'ARWEAVE_KEYFILE'
    }),
    yes: flags.boolean({
      char: 'y'
    })
  },
  arweave,
  confirm
}
