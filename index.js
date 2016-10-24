let argv = require('yargs')
           .default('dir', process.cwd())
           .argv

const ROOT_PATH = argv.dir

if (ROOT_PATH === '/') {
    throw new Error('Do not play with fire...')
}

let httpServer = require('./server-express')(ROOT_PATH)
let tcpServer = require('./server-tcp')(ROOT_PATH)

const HTTP_PORT = 8000
const TCP_PORT = 8001

httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP server listening at PORT ${HTTP_PORT}`)
})

tcpServer.listen(TCP_PORT, () => {
    console.log(`TCP server listening at PORT ${TCP_PORT}`)
})

console.log(`VFS's root path is at ${ROOT_PATH}`)
