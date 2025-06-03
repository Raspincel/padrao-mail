import { Mailbox } from "./mailbox.js";
import readline from "readline";

/**
 * Main application file that provides a command-line interface for testing the message system.
 * Users can input condition codes and see which message would be returned.
 */

// Create readline interface for user input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a mailbox with predefined form validation messages
const mailbox = Mailbox.createFormMailbox("No condition matched your request");

/**
 * Collects numbers from user input until a negative number is entered
 * @returns {Promise<number[]>} Promise resolving to an array of entered numbers
 */
function collectNumbers() {
  return new Promise<number[]>((resolve) => {
    const numbers: number[] = [];

    console.log("Enter numbers (negative number to stop):");

    // Recursive function to keep asking for numbers
    const askForNumber = () => {
      rl.question("Enter a number: ", (input) => {
        const num = parseFloat(input.trim());

        // Validate input is a number
        if (isNaN(num)) {
          console.log("Please enter a valid number.");
          askForNumber();
          return;
        }

        // Negative number signals end of input
        if (num < 0) {
          console.log("Processing...");
          resolve(numbers);
          return;
        }

        // Add valid number and continue
        numbers.push(num);
        askForNumber();
      });
    };

    askForNumber();
  });
}

/**
 * Processes the entered numbers by finding the highest priority message that matches
 * @param {number[]} numbers - Array of condition codes to check
 */
async function processMailbox(numbers) {
  if (numbers.length > 0) {
    // Get the highest priority message matching any of the conditions
    const message = mailbox.getHighestPriorityMessage(numbers);
    if (message) {
      console.log("Chosen message:", message.getValue());
    } else {
      console.log("No matching message found.");
    }
  } else {
    console.log("No numbers were entered.");
  }
}

/**
 * Main application loop
 * Continually collects numbers and processes them until program is terminated
 */
async function main() {
  console.log("Mailbox Message Processor");
  console.log("========================");

  while (true) {
    try {
      // Collect condition codes from user
      const numbers = await collectNumbers();
      
      // Process the codes to find a matching message
      await processMailbox(numbers);

      console.log("\n" + "=".repeat(40) + "\n");

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  }
}

// Handle Ctrl+C gracefully
process.on("SIGINT", () => {
  console.log("\n\nGoodbye!");
  rl.close();
  process.exit(0);
});

main();
