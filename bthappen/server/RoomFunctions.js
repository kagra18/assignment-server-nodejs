/**
 * Class for API search functions.
 *
 */

class RoomFunctions {


    /**
    * Display available API:s.
    */
    viewApi() {
        this.apiList = ["Display this text.", "Display all rooms.",
        "Display room by room id.", "Display all rooms in one building.",
        "General search using keyword.", "Sorted search using keyword."];
            return this.apiList;
    }


    /**
     * Return JavaScript array with parsed JSON.
     */
    allRooms(parsedRooms) {
        this.rooms = parsedRooms.salar;
            return this.rooms;
        }


    /**
     * Filter by room id. Generates single object.
     *
     * @param  String number contains input id from user.
     *
     * @throws Error if id is wrong.
     *
     */

    getRoomById(parsedRooms, number) {
        number = number.toUpperCase();

        this.roomById = this.allRooms(parsedRooms).find(id =>
            id.Salsnr === number);

        if (this.roomById == null) {
            throw new Error("Room id does not exist.");
        }
        return this.roomById;
    }



    /**
     * Filter by building. List room names only.
     *
     * @param  String house contains input building from user.
     *
     * @throws Error if house not in file.
     *
     */

    getRoomByBuilding(parsedRooms, house) {
        var roomDetails;
        var roomByBuilding;

        if (house.includes("%20")) {
            house = house.replace("%20", " ");
        }

        roomDetails = this.allRooms(parsedRooms).filter(building =>
            building.Hus != null && building.Hus.toString().toLowerCase()
            === house.toLowerCase());

        if (this.arrayIsEmpty(roomDetails)) {
            throw new Error("Building does not exist.");
        }

        roomByBuilding = roomDetails.filter(a => a.Salsnamn !== null)
        .map(b => b.Salsnamn);

        return roomByBuilding;
    }


    /**
     * Filter by search string. List full details of all matching rooms.
     *
     * @param  String search contains input search phrase from user.
     *
     * @throws Error if search string does not match anything in file..
     *
     */

    getRoomBySearch(parsedRooms, search) {
        var roomBySearch;

        if (search.includes("%20")) {
            search = search.replace("%20", " ");
        }

        roomBySearch = this.allRooms(parsedRooms).filter(value =>
             Object.keys(value).some(k => value[k] != null &&
             value[k].toString().toLowerCase()
             .includes(search.toLowerCase())));

         if (this.arrayIsEmpty(roomBySearch)) {
             throw new Error("No match.")
         }
         return roomBySearch
    }


    /**
     * Filter by search string. List details on rooms, sorted according to prio.
     *
     * @param  String search contains input search phrase from user.
     *
     * @throws Error through function 'getRoomBySearch' if search string does not match anything in file.
     *
     */

    getRoomByPrio(parsedRooms, searchPrio) {

        if (searchPrio.includes("%20")) {
            searchPrio = searchPrio.replace("%20", " ");
        }

        var roomByPrio = this.getRoomBySearch(parsedRooms, searchPrio);

            roomByPrio.filter(value => {

                //Prio 1 if exact match in any field. Case insensitive.
                if (value.Salsnamn != null && value.Salsnamn.toLowerCase() === searchPrio.toLowerCase()
                    || value.Salsnr != null && value.Salsnr === searchPrio.toUpperCase()
                    || value.Lat != null && value.Lat === searchPrio
                    || value.Lat != null && value.Long === searchPrio
                    || value.Hus != null && value.Hus.toLowerCase() === searchPrio.toLowerCase()
                    || value.Våning != null && value.Våning === searchPrio
                    || value.Storlek != null && value.Storlek === searchPrio
                    || value.Typ != null && value.Typ.toLowerCase() === searchPrio.toLowerCase()
                    || value.Ort != null && value.Ort.toLowerCase() === searchPrio.toLowerCase()) {
                        value.Prio = 1;

                //Prio 0.75 if first charahcters match in higest ranking fields. Case insensitive.
                 } else if  (value.Salsnamn != null && value.Salsnamn.toLowerCase().substring(0, 4) === searchPrio.toLowerCase().substring(0, 4)
                            || value.Salsnr != null && value.Salsnr.substring(0, 3) === searchPrio.toUpperCase().substring(0, 3)
                            || value.Ort != null && value.Ort.toLowerCase().substring(0, 4) === searchPrio.toLowerCase().substring(0, 4)
                            || value.Hus != null && value.Hus.toLowerCase().substring(0, 4) === searchPrio.toLowerCase().substring(0, 4)) {
                                value.Prio = 0.75;

                //Prio 0.50 if first charahcters match in lower ranking fields. Case insensitive.
                } else if (value.Typ != null && value.Typ.toLowerCase().substring(0, 4) === searchPrio.toLowerCase().substring(0, 4)
                            || value.Lat != null && value.Lat.substring(0, 4) === searchPrio.substring(0, 4)
                            || value.Long != null && value.Long.substring(0, 4) === searchPrio.substring(0, 4)) {
                                value.Prio = 0.50;

                //Prio 0.25 for general matches in any field,
                //including first charachter matches for fields 'Våning' och 'Storlek' Case insensitive.
                 } else {
                     value.Prio = 0.25
                 }

             });

             return roomByPrio.sort((a, b) => (a.Prio < b.Prio) ? 1 : -1);
         }


    /**
     * Check if arrays generated by functions contain elements.
     *
     * @throws Error if array does not contain any elements.
     *
     */

    arrayIsEmpty(roomByValue) {
        return roomByValue.length !== 0 ? false : true;
    }
}

// export RoomFunctions;
module.exports = RoomFunctions;
