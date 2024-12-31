import * as readline from "readline";

const countryMap: Record<string, { fullName: string; neighbors: string[] }> = {
    IN: { fullName: "India", neighbors: ["Pakistan", "China", "Nepal", "Bangladesh", "Bhutan", "Myanmar"] },
    US: { fullName: "United States", neighbors: ["Canada", "Mexico"] },
    NZ: { fullName: "New Zealand", neighbors: [] },
    CN: { fullName: "China", neighbors: ["India", "Russia", "Nepal", "Mongolia", "Kazakhstan"] },
};

function findNeighbors(code: string): string {
    const countryInfo = countryMap[code.toUpperCase()];
    if (!countryInfo) {
        return "Error: Country code not found.";
    }
    const { fullName, neighbors } = countryInfo;
    return neighbors.length === 0
        ? `${fullName} has no neighboring countries.`
        : `Neighbors of ${fullName}: ${neighbors.join(", ")}`;
}

function startCountrySearch(): void {
    const userInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    function askForCode() {
        userInterface.question("Enter a country code (e.g., IN, US, NZ): ", (code) => {
            console.log(findNeighbors(code));
            userInterface.question("Do you want to check another country? (yes/no): ", (response) => {
                if (response.trim().toLowerCase() === "yes") {
                    askForCode();
                } else {
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
