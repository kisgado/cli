const parseAllowScriptsList = require('@npmcli/config/lib/parse-allow-scripts-list.js')

// Builds the `npm config set allow-scripts` command suggested to global
// users, who have no project package.json for `npm approve-scripts` to
// write to. `--location=user` keeps the setting in the user .npmrc instead
// of trying (and, for global installs, failing) to write it to the local
// project config. `npm config set` replaces the existing value, so entries
// already in the user config are kept at the front of the list. That is
// only done when every entry is a plain name that can be pasted into a
// shell unquoted; pins like `pkg@1 || 2` and URLs are not repeated.
const configSetAllowScripts = (npm, names) => {
  const existing = parseAllowScriptsList(npm.config.get('allow-scripts', 'user'))
  const keep = existing.every(e => /^[\w@./-]+$/.test(e)) ? existing : []
  const merged = [...new Set([...keep, ...names])]
  return `npm config set allow-scripts=${merged.join(',')} --location=user`
}

module.exports = { configSetAllowScripts }
