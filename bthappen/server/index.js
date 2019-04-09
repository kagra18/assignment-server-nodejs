#!/usr/bin/env node

/**
 * Main program to run the server
 *
 */
"use strict";

const VERSION = "1.0";

// For CLI usage
var path = require("path");
var fs = require("fs");
var scriptName = path.basename(process.argv[1]);
var args = process.argv.slice(2);
var arg;
var port = 1337;


// Get the server with defaults
// import server routes from "./room-routes.js";
var server = require("./room-routes.js");


/**
 * Write process id to file.
 */
var pidFile = path.join(__dirname, "pid");
fs.writeFile(pidFile, process.pid, function(err) {
    if (err) {
        return console.log(err);
    }

    console.log("Wrote Process ID to file 'pid'.");
});


/**
 * Display help text about usage of this script.
 */
function usage() {
    console.log(`Usage: ${scriptName} [options]

Options:
 -h               Display help text.
 -v               Display the version.
 --port <number>  Run server on this port.`);
}



/**
 * Display help text about bad usage.
 *
 * @param String message to display.
 */
function badUsage(message) {
    console.log(`${message}
Use -h to get an overview of the commands.`);
}



/**
 * Display version.
 */
function version() {
    console.log("Version " + VERSION);
}



// Walkthrough all arguments checking for options.
while ((arg = args.shift()) !== undefined) {
    switch (arg) {
        case "-h":
            usage();
            process.exit(0);
            break;

        case "-v":
            version();
            process.exit(0);
            break;

        case "--port":
            port = Number.parseInt(args.shift());
            if (Number.isNaN(port)) {
                badUsage("--port must be followed by a port number.");
                process.exit(1);
            }
            break;

        default:
            // remainingArgs.push(arg);
            badUsage("Unknown argument.");
            process.exit(1);
            break;
    }
}

// Main

server.listen(port);
console.log("The server is now listening on port " + port + ".");
