require('songbird')
let fs = require('fs')
let chokidar = require('chokidar')
let nssocket = require('nssocket')
let path = require('path')
let watcher = require('./watcher')
let payloadHandler = require('./payload-handler')

const PORT = 8001

module.exports = rootPath => {
    return nssocket.createServer(socket => {
        watcher.watch(rootPath, data => {
            console.log(data)
            socket.send(['serverContentChange'], data)
        })

        socket.data(['clientContentChange'], payload => {
            // temporarily unwatch the file so that changes event won't be sent
            // back to the client, and thus prevent creating an infinite loop
            // console.log(payload)
            let filePath = path.join(rootPath, payload.path)
            watcher.unwatch(filePath)
            payloadHandler[payload.event](rootPath, payload, err => {
                (err) ? console.log(err) : setTimeout(() => watcher.add(filePath), 200)
            })
        })
    })
}
