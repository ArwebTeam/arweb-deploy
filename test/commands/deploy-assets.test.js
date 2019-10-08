const { expect, test } = require('@oclif/test')

describe('deploy-assets', () => {
  test
    .stdout()
    .command(['deploy-assets'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['deploy-assets', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
