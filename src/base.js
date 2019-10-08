'use strict'

const { flags } = require('@oclif/command')

module.exports = {
  flags: {
    'key-file': flags.string({
      char: 'k',
      description: 'Path to arweave key-file',
      required: true,
      parse: path => require(path),
      env: 'ARWEAVE_KEYFILE'
    })
  }
}
