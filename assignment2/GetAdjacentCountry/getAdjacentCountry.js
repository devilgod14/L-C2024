"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var countryMap = {
    IN: { fullName: "India", neighbors: ["Pakistan", "China", "Nepal", "Bangladesh", "Bhutan", "Myanmar"] },
    US: { fullName: "United States", neighbors: ["Canada", "Mexico"] },
    NZ: { fullName: "New Zealand", neighbors: [] },
    CN: { fullName: "China", neighbors: ["India", "Russia", "Nepal", "Mongolia", "Kazakhstan"] },
};
function findNeighbors(code) {
    var countryInfo = countryMap[code.toUpperCase()];
    if (!countryInfo) {
        return "Error: Country code not found.";
    }
    var fullName = countryInfo.fullName, neighbors = countryInfo.neighbors;
    return neighbors.length === 0
        ? "".concat(fullName, " has no neighboring countries.")
        : "Neighbors of ".concat(fullName, ": ").concat(neighbors.join(", "));
}
function startCountrySearch() {
    var userInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    function askForCode() {
        userInterface.question("Enter a country code (e.g., IN, US, NZ): ", function (code) {
            console.log(findNeighbors(code));
            userInterface.question("Do you want to check another country? (yes/no): ", function (response) {
                if (response.trim().toLowerCase() === "yes") {
                    askForCode();
                }
                else {
                    console.log("Thank you for using the Country Neighbor Finder. Goodbye!");
                    userInterface.close();
                }
            });
        });
    }
    console.log("Welcome to the Country Neighbor Finder!");
    askForCode();
}
startCountrySearch();
