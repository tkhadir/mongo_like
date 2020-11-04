var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:')

let init = () => {
    db.serialize(() => {
        db.run("CREATE TABLE documents (jdoc JSON)")
    })
}

let save = (doc) => {
    try {
        db.serialize(() => {
            db.run("INSERT INTO documents VALUES('" + JSON.stringify(doc) + "')")
        })
    } catch (e) {
        console.error(e)
    }
}

let list = (callback) => {
    db.all("select jdoc from documents",[], (err, rows) => {
            callback(rows)
    })
}

module.exports.init = init
module.exports.save = save
module.exports.list = list