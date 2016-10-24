require('songbird')
let fs = require('fs')

async function post(req, res) {
    if (req.requestedDirectory) return res.status(405).send()

    await fs.promise.truncate(req.filePath, 0)
    fs.writeFile(req.filePath, req.body, err => {
        (err) ? res.status(500).send() : res.status(200).send()
    })
}

module.exports = post
