const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const inPath = path.join(rootPath, '../eol-watcher-package')
  const outPath = path.join(rootPath, '../eol-watcher-installer')

  return Promise.resolve({
    appDirectory: path.join(inPath, 'eol-watcher-win32-ia32/'),
    authors: 'Bartosz Glowacki (joinee / Stooq)',
    noMsi: true,
    outputDirectory: path.join(outPath, 'win'),
    exe: 'eol-watcher.exe',
    setupExe: 'EolWatcher.exe',
    setupIcon: path.join(rootPath, 'assets', 'app.ico')
  })
}