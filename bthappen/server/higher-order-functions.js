(function () {
    "use strict"
    var players = [
        { name: "Tom Brady", position: "Quarterback" },
        { name: "Julian Edelman", position: "Wide Reciever"},
        { name: "Chris Hogan", position: "Wide Reciever"},
        { name: "Danny Amendola", position: "Wide Reciever"},
        { name: "LaGarette Blount", position: "Running Back"},
        { name: "James White", position: "Running Back"},
        { name: "Dion Lewis", position: "Running Back"},
    ];

    var mapped = players.map(player => player.name + " plays " + player.position);

    console.log(mapped)

})();
