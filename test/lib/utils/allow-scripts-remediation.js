const t = require('tap')
const { configSetAllowScripts } = require('../../../lib/utils/allow-scripts-remediation.js')

const npmWithUser = (value) => ({
  config: { get: (key, where) => where === 'user' ? value : undefined },
})

t.test('suggests only the new names when the user config is empty', async t => {
  t.equal(
    configSetAllowScripts(npmWithUser(undefined), ['canvas', 'sharp']),
    'npm config set allow-scripts=canvas,sharp --location=user'
  )
})

t.test('keeps existing user entries in front, without duplicates', async t => {
  t.equal(
    configSetAllowScripts(npmWithUser('esbuild, @scope/pkg, sharp'), ['canvas', 'sharp']),
    'npm config set allow-scripts=esbuild,@scope/pkg,sharp,canvas --location=user'
  )
})

t.test('does not repeat entries that would need shell quoting', async t => {
  for (const entry of ['esbuild@1.0.0 || 2.0.0', 'sharp@*', 'https://host/pkg.tgz?token=x']) {
    t.equal(
      configSetAllowScripts(npmWithUser(['esbuild', entry]), ['canvas']),
      'npm config set allow-scripts=canvas --location=user',
      entry
    )
  }
})
