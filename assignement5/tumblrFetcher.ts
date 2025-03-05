import fetch from 'node-fetch';
import * as readline from 'readline';

// Interface for user interaction
interface UserInteraction {
    getPostLimit(): Promise<number>;
}

// Implementation of user interaction using readline
class ConsoleUserInteraction implements UserInteraction {
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    async getPostLimit(): Promise<number> {
        return new Promise((resolve) => {
            this.rl.question('Enter the number of top Reddit image posts to fetch (1-25): ', (limit) => {
                const num = parseInt(limit, 10);
                if (isNaN(num) || num < 1 || num > 25) {
                    console.log('Invalid input. Please enter a number between 1 and 25.');
                    resolve(this.getPostLimit());
                } else {
                    resolve(num);
                }
            });
        });
    }

    close() {
        this.rl.close();
    }
}

// Function to fetch top images from r/pics
async function fetchRedditImages(limit: number): Promise<void> {
    const url = `https://www.reddit.com/r/pics/top.json?limit=${limit}`;

    try {
        const response = await fetch(url);
        const jsonData = await response.json();

        console.log("\nReddit /r/pics Top Image Posts:");
        jsonData.data.children.forEach((post: any, index: number) => {
            if (post.data.post_hint === "image") {  // Ensure it's an image post
                console.log(`\n${index + 1}: ${post.data.title}`);
                console.log(`Image URL: ${post.data.url}`);
            }
        });

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Main function to interact with user and fetch data
async function main() {
    const ui = new ConsoleUserInteraction();
    const postLimit = await ui.getPostLimit();
    await fetchRedditImages(postLimit);
    ui.close();
}

main();
