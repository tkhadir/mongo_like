const rxjs = require('rxjs')
const db = require('./db')
const path = require('path')
module.exports = (app) => {
    db.init()
    let checkup$ = new rxjs.Subject()

    app.get('/', (req, res) => checkup$.next([req, res]))
    checkup$
    .subscribe((args) => {
            let [req, res] = args
            res.sendFile(path.join(__dirname + '/index.html'))
    })

    let list$ = new rxjs.Subject()
    app.get('/list', (req, res) => list$.next([req, res]))
    list$
    .subscribe((args) => {
            let [req, res] = args
            let results = []
            db.list((rows) => {
                rows.forEach(r => {
                  results.push(JSON.parse(r.jdoc))
                })
                console.log(results)
                res.send(results)
            })
    })

    let save$ = new rxjs.Subject()
    app.post('/save', (req, res) => save$.next([req, res]))
    save$
    .subscribe((args) => {
            let [req, res] = args
            console.log(req.body)
            if (req.body) db.save(req.body)
            else console.log('invalid body sent')
            res.send('done')
    })

}