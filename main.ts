import { Mailbox } from "./mailbox.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const mailbox = Mailbox.createFormMailbox("No condition matched your request");

function collectNumbers() {
  return new Promise<number[]>((resolve) => {
    const numbers: number[] = [];

    console.log("Enter numbers (negative number to stop):");

    const askForNumber = () => {
      rl.question("Enter a number: ", (input) => {
        const num = parseFloat(input.trim());

        if (isNaN(num)) {
          console.log("Please enter a valid number.");
          askForNumber();
          return;
        }

        if (num < 0) {
          console.log("Processing...");
          resolve(numbers);
          return;
        }

        numbers.push(num);
        askForNumber();
      });
    };

    askForNumber();
  });
}

async function processMailbox(numbers) {
  if (numbers.length > 0) {
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

async function main() {
  console.log("Mailbox Message Processor");
  console.log("========================");

  while (true) {
    try {
      const numbers = await collectNumbers();
      await processMailbox(numbers);

      console.log("\n" + "=".repeat(40) + "\n");

      // Small delay before next iteration
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
