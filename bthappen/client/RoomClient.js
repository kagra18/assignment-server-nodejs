/**
 * Front for index-client.
 */

// Main class for search algorithms.
// import RoomFunctions from "../server/RoomFunctions.js";
var RoomFunctions = require("../server/RoomFunctions.js");


// Import the http server as base
var http = require("http");



/**
 * Class for Search algorithms.
 *
 */
class RoomClient {

    /**
     * Constructor.
     *
     */
    constructor() {
        this.roomSearch = new RoomFunctions();
    }



    /**
     * Set the url of the server to connect to.
     *
     * @param  String url to use to connect to the server.
     *
     */
    setServer(url) {
        this.server = url;
    }



    /**
     * Make a HTTP GET request, wrapped in a Promise.
     *
     * @param  String url to connect to.
     *
     * @return Promise
     *
     */
    httpGet(url) {
        return new Promise((resolve, reject) => {
            http.get(this.server + url, (res) => {
                var data = "";

                res.on('data', (chunk) => {
                    data += chunk;
                }).on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                }).on('error', (e) => {
                    reject("Got error: " + e.message);
                });
            });
        });
    }



    /**
     * Display available API:s.
     *
     * @return Promise
     */

     api() {
         return this.httpGet("/")
     }



     /**
      * Display all rooms.
      *
      * @return Promise
      */

     allRooms() {
         return this.httpGet("/room/list");
     }


     /**
      * Filter by room id.
      *
      * @param  String number given id.
      *
      * @return Promise
      *
      */

    roomByNumber(number) {
        return this.httpGet("/room/view/id/" + number);
    }


    /**
     * Filter by building.
     *
     * @param  String house given building.
     *
     * @return Promise
     *
     */

    roomByHouse(house) {
        return this.httpGet("/room/view/house/" + house);
    }


    /**
     * Filter by search phrase.
     *
     * @param  String search given search phrase.
     *
     * @return Promise
     *
     */

    roomBySearch(search) {
        return this.httpGet("/room/search/" + search);
    }


    /**
     * Filter and sort by search phrase.
     *
     * @param  String search given search phrase.
     *
     * @return Promise
     *
     */

    roomByPrio(searchPrio) {
        return this.httpGet("/room/searchp/" + searchPrio);
    }
}

// export default RoomClient;
module.exports = RoomClient;
