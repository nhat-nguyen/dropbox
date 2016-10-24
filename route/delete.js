let rimraf = require('rimraf')

function del(req, res) {
    rimraf(req.filePath, err => {
        (err) ? res.status(500).send() : res.status(200).send()
    })
}

module.exports = del
