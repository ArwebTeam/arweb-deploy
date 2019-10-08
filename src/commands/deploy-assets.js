'use strict'

const path = require('path')
const fs = require('fs')
const uPath = require('upath')

require('console-table')

const prom = f => new Promise((resolve, reject) => f((err, res) => err ? reject(err) : resolve(res)))

const Arweave = require('arweave/node')
const arweave = Arweave.init({ protocol: 'https', host: 'arweave.net' })
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

const { flags } = require('../base')

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

      await arweave.transactions.sign(tx, flags['key-file'])
      // const response = await arweave.transactions.post(tx)
      return { /* response, */ tx, path: relativePath, size: stat.blksize }
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

    console.table(table)
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
