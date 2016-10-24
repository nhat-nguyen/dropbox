let request = require('request')
let nssocket = require('nssocket')
let fs = require('fs')
let DecompressZip = require('decompress-zip')
let payloadHandler = require('./payload-handler')
let watcher = require('./watcher')
let path = require('path')
let argv = require('yargs')
           .default('dir', process.cwd())
           .argv

const ROOT_PATH = argv.dir
const TEMP_FILE = 'initial.zip'
const PORT = 8001

let handlers = {
    'add': payloadHandler.add,
    'addDir': payloadHandler.addDir,
    'change': payloadHandler.change,
    'unlink': payloadHandler.unlink,
    'unlinkDir': payloadHandler.unlinkDir
}

function initialSync(cb) {
    let tempPath = path.join(ROOT_PATH, TEMP_FILE)
    let file = fs.createWriteStream(tempPath)

    file.on('finish', () => {
        var unzipper = new DecompressZip(tempPath)
        unzipper.on('extract', () => {
            fs.unlink(tempPath)
            cb()
        })
        .extract({path: ROOT_PATH})
    })

    request({
        url: 'http://127.0.0.1:8000/',
        headers: {'accept': 'application/x-gtar'}
    }).pipe(file)
}

function main() {
    let outbound = new nssocket.NsSocket();

    outbound.connect(PORT, () => {
        console.log(`Client connected to port ${PORT}`)
        watcher.watch(ROOT_PATH, data => {
            outbound.send(['clientContentChange'], data)
        })    
    })

    outbound.data(['serverContentChange'], payload => {
        // temporarily unwatch the file so that changes event won't be sent
        // back to the client, and thus prevent creating an infinite loop
        let filePath = path.join(ROOT_PATH, payload.path)
        watcher.unwatch(filePath)
        payloadHandler[payload.event](ROOT_PATH, payload, err => {
            // TODO: Not sure why the event is fired without setTimeout
            (err) ? console.log(err) : setTimeout(() => watcher.add(filePath), 200)
        })
    })
}

initialSync(() => main())
