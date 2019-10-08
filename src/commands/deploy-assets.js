'use strict'

const path = require('path')
const fs = require('fs')
const uPath = require('upath')

/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

const prom = f => new Promise((resolve, reject) => f((err, res) => err ? reject(err) : resolve(res)))

const Mimos = require('@hapi/mimos')
const mimos = new Mimos()

const prettyBytes = require('pretty-bytes')

function walk (p) {
  const stat = fs.statSync(p)

  if (stat.isDirectory()) {
    const files = fs.readdirSync(p).map(file => walk(path.join(p, file)))

    return files.reduce((all, folderContents) => all.concat(folderContents), [])
  }
  if (stat.isFile()) return p

  throw new TypeError('File type not known, please report: ' + JSON.stringify(stat))
}

const { cli } = require('cli-ux')
const { flags, arweave, confirm } = require('../base')
const { Command } = require('@oclif/command')

class DeployAssetsCommand extends Command {
  async run () {
    const { flags, args } = this.parse(DeployAssetsCommand)

    const { path: root, 'app-id': appId } = args

    const files = await walk(root)

    const results = await Promise.all(files.map(async file => {
      const content = await prom(cb => fs.readFile(file, cb))

      const stat = fs.statSync(file)

      const relativePath = uPath.join('/', uPath.relative(root, file))

      const tx = await arweave.createTransaction({
        data: content
      }, flags['key-file'])

      tx.addTag('app', appId)
      tx.addTag('path', relativePath)
      tx.addTag('Content-Type', mimos.path(file).type)

      return { tx, path: relativePath, size: stat.blksize }
    }))

    const total = results.reduce((total, add) => {
      total.price += parseInt(add.tx.reward, 10)
      total.size += add.size

      return total
    }, {
      size: 0,
      price: 0
    })

    const table = results.map(r => {
      return {
        path: r.path,
        size: prettyBytes(r.size),
        price: arweave.ar.winstonToAr(r.tx.reward) + 'AR'
      }
    }).concat({
      path: '[total]',
      size: prettyBytes(total.size),
      price: arweave.ar.winstonToAr(String(total.price)) + 'AR'
    })

    console.log('')
    cli.table(table, {
      path: {
        minWidth: 5
      },
      size: {
        minWidth: 4
      },
      price: {
        minWidth: 10
      }
    }, {
      printLine: this.log
    })
    console.log('')

    if (!flags.yes) {
      await confirm()
    }

    cli.action.start('publishing...')

    // const address = arweave.wallets.jwkToAddress(flags['key-file'])

    for (let i = 0; i < results.length; i++) {
      const r = results[i]

      // r.tx.last_tx = arweave.wallets.getLastTransactionID(address)

      await arweave.transactions.sign(r.tx, flags['key-file'])
      const response = await arweave.transactions.post(r.tx)

      this.log('Published %s as %s: %o', r.path, r.tx.id, response.data)
    }

    cli.action.stop('done')
  }
}

DeployAssetsCommand.description = 'Deploys assets to the permaweb'

DeployAssetsCommand.flags = flags

DeployAssetsCommand.args = [
  {
    name: 'path', // name of arg to show in help and reference with args[name]
    required: true, // make the arg required with `required: true`
    description: 'Path to assets', // help description
    parse: fs.realpathSync
  },
  {
    name: 'app-id', // name of arg to show in help and reference with args[name]
    required: true, // make the arg required with `required: true`
    description: 'App ID to update' // help description
  }
]

module.exports = DeployAssetsCommand
