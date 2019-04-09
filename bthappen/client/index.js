#!/usr/bin/env node

/**
 * Main program to run the room search server.
 *
 */
"use strict";

const VERSION = "1.0";

// For CLI usage
var path = require("path");
var scriptName = path.basename(process.argv[1]);
var args = process.argv.slice(2);
var arg;

// Default values
var port = 1337;
var host = "localhost";


// Get the server with defaults
// import RoomCLient from "./RoomClient.js";
var RoomClient = require("./RoomClient.js");


var rooms = new RoomClient();




// Use prompt
var readline = require("readline");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



/**
 * Display help text about usage of script.
 */
function usage() {
    console.log(`Usage: ${scriptName} [options]

Options:
 -h               Display help text.
 -v               Display the version.
 --server <url>   Set server url to use.
 --port <port>    Set port to use.`);
}



/**
 * Display help text about bad usage.
 *
 * @param String message to display.
 */
function badUsage(message) {
    console.log(`${message}
Use -h to get an overview of the command.`);
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

        case "--server":
            host = args.shift();
            if (host === undefined) {
                badUsage("--server must be followed by a url.");
                process.exit(1);
            }
            break;

        case "--port":
            port = args.shift();
            if (port === undefined) {
                badUsage("--port must be followed by a number.");
                process.exit(1);
            }
            break;

        default:
            badUsage("Unknown argument.");
            process.exit(1);
            break;
    }
}



/**
 * Display a menu.
 */
function menu() {
console.log(`Commands available:
exit                    Leave this program.
menu                    Print this menu.
url                     Get url to view server in browser.
list                    List all rooms.
view <id>               View room with selected id.
house <house>           View the names of all rooms in this building (house).
search <string>         View the details of all matching rooms.
search sort <string>    View the details of all matching rooms in sorted order.\n`);
}



/**
 * Callbacks for search algorithms.
 */
rl.on("line", function(line) {
    // Split incoming line with arguments into an array.
    var args = line.trim().split(" ");

    args = args.filter(value => {
        return value !== "";
    });

    switch (args[0]) {
        case "exit":
            console.log("Bye!");
            process.exit(0);
            break;

        case "menu":
            menu();
            rl.prompt();
            break;

        case "list":
            rooms.allRooms()
                .then(value => {
                    console.log(value);
                    rl.prompt();
                })
            break;

        case "view":
            //store id input from user
            var number = args[1];
            rooms.roomByNumber(number)
                .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not display room.\nDetails: " + err);
                    rl.prompt();
                });
            break;

        case "house":
            var house;

            // check if more args than two
            // escape spaces for url format if nessecary
            if (args.length > 1) {
                house = args.slice(1).join("%20")
            } else {
                house = args[1]
            }

            rooms.roomByHouse(house)
                .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not list rooms.\nDetails: " + err);
                    rl.prompt();
                });
            break;

        case "search":
            var search;
            var searchPrio;

            // check if first arg is 'sort'
            if (args[1] === "sort") {
                // check if more args than three
                // escape spaces for url format if nessecary
                if (args.length > 3) {
                    searchPrio = args.slice(2).join("%20")
                } else {
                    searchPrio = args[2];
                }
                rooms.roomByPrio(searchPrio)
                    .then(value => {
                        console.log(value);
                        rl.prompt();
                    })
                    .catch(err => {
                        console.log("FAILED: Could not list rooms.\nDetails: " + err);
                        rl.prompt();
                    });
                } else {

                    // check if more args than two
                    // escape spaces for url format if nessecary
                    if (args.length > 1) {
                        search = args.slice(1).join("%20");
                    } else {
                        search = args[1];
                    }

                    rooms.roomBySearch(search)
                        .then(value => {
                            console.log(value);
                            rl.prompt();
                        })
                        .catch(err => {
                            console.log("FAILED: Could not list rooms.\nDetails: " + err);
                            rl.prompt();
                        });
                    }
            break;

        case "url":
            console.log("Use this url to view in browser.\n" + server);
            rl.prompt();
            break;

        default:
            console.log("Enter 'menu' to get an overview of what you can do here.");
            rl.prompt();
    }
});

rl.on("close", function() {
    console.log("Bye!");
    process.exit(0);
});

var server = "http://" + host + ":" + port;

// Main
rooms.setServer(server);
console.log("Ready to talk to server url '" + server + "'.");
console.log("Use -h to get a list of options to start this program.");
console.log("Use 'menu' to get a list of commands.\n");
rl.setPrompt("BTH rooms$ ");
rl.prompt();
