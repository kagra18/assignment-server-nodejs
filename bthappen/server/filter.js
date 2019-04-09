(function () {
    "use strict";

    var players = [
        { name: "Tom Brady", position: "Quarterback" },
        { name: "Julian Edelman", position: "Wide Reciever"},
        { name: "Chris Hogan", position: "Wide Reciever"},
        { name: "Danny Amendola", position: "Wide Reciever"},
        { name: "LaGarette Blount", position: "Running Back"},
        { name: "James White", position: "Running Back"},
        { name: "Dion Lewis", position: "Running Back"},
    ];

    function playerIsWR(player) {
        return player.position === "Wide Reciever";
    }

    var mapped = players.map(player => player.name + " plays " + player.position);

    console.log(mapped);

    var filtered = players.filter(playerIsWR);

    console.log(filtered);

    var filteredAndMapped = players.filter(playerIsWR).map(player => player.name + " plays " + player.position);

    console.log(filteredAndMapped);

})();
