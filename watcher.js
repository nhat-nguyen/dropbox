require('songbird')
let chokidar = require('chokidar')
let fs = require('fs')
let relative = require('path').relative

module.exports = (() => {
    let watcher = chokidar.watch([], { ignored: /[\/\\]\./, ignoreInitial: true })

    let watch = (rootPath, cb) => {
        watcher.add(rootPath)
        .on('all', (event, filePath) => {
            let path = relative(rootPath, filePath)
            if (event === 'add' || event === 'change') {
                fs.promise.readFile(filePath, 'utf-8').then(content => {
                    cb({ event, path, content })
                })
            } else {
                cb({ event, path })
            }
        })
    }

    let unwatch = filePath => {
        watcher.unwatch(filePath)
    }

    let add = filePath => watcher.add(filePath)

    return { watch, unwatch, add }
})()
