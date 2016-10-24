require('songbird')
let rimraf = require('rimraf')
let mkdirp = require('mkdirp')
let path = require('path')
let fs = require('fs')

function add(rootPath, payload, cb) {
    let filePath = path.join(rootPath, payload.path)
    fs.writeFile(filePath, payload.content, err => {
        if (cb) cb(err)
    })
}

function addDir(rootPath, payload, cb) {
    mkdirp(path.join(rootPath, payload.path), err => {
        if (cb) cb(err)
    })
}

function change(rootPath, payload, cb) {
    add(rootPath, payload, cb)
}

function unlink(rootPath, payload, cb) {
    rimraf(path.join(rootPath, payload.path), err => {
        if (cb) cb(err)
    })
}

function unlinkDir(rootPath, payload, cb) {
    unlink(rootPath, payload, cb)
}

module.exports = {
    add, addDir, change, unlink, unlinkDir
}
