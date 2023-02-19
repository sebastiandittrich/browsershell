#!/usr/bin/env node

const { Command } = require("commander");
const { startConsoleCatcher } = require("../console-catcher");
const { startReverseShell } = require("../reverse-shell");

const program = new Command();

program
    .command("shell <host> <port>")
    .action(async (host, port) => {
        startReverseShell(host, parseInt(port))
    });

program
    .command("console-catcher <host> <port>")
    .action(async (host, port) => {
        startConsoleCatcher(host, parseInt(port))
    });

program.parse(process.argv);
