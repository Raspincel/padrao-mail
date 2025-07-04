import { CONDITIONS } from "./constants.js";
import { Envelope } from "./envelope.js";
import { Message } from "./message.js";

/**
 * Mailbox extends the Envelope class to provide higher-level messaging functionality.
 * It acts as a factory for creating pre-configured message systems.
 */
export class Mailbox extends Envelope {
  /**
   * Creates a new Mailbox with specified messages and default message
   * @param {Message[]} messages - Optional array of messages to add to the mailbox
   * @param {string} defaultMessage - Optional text for the default message
   */
  constructor(messages?: Message[], defaultMessage?: string) {
    // Initialize parent class
    super();

    // Create default message with lowest priority and no conditions
    this.message = new Message({
      value: defaultMessage || "No matching condition found",
      priority: 0,
      conditions: [],
    });

    // Add provided messages or use example messages if none provided
    if (messages) {
      this.addMessages(messages);
    } else {
      // Default example messages if none provided
      this.addMessages([
        new Message({ value: "M1", priority: 1, conditions: [1] }),
        new Message({ value: "M2", priority: 2, conditions: [2, 9] }),
        new Message({ value: "M3", priority: 3, conditions: [6] }),
        new Message({ value: "M4", priority: 1, conditions: [3, 4] }),
        new Message({ value: "M5", priority: 4, conditions: [1, 5] }),
      ]);
    }
  }

  /**
   * Adds multiple messages to the mailbox at once
   * @param {Message[]} messages - Array of messages to add
   */
  public addMessages(messages: Message[]): void {
    for (const message of messages) {
      this.addMessage(message);
    }
  }

  /**
   * Factory method that creates a mailbox with predefined messages for form validation
   * Contains common error messages for authentication and account-related issues
   * @param {string} defaultMessage - Optional text for the default message
   * @returns {Mailbox} A new mailbox instance with form validation messages
   */
  public static createFormMailbox(defaultMessage?: string): Mailbox {
    return new Mailbox(
      [
        // Simple condition messages (one condition each)
        new Message({
          value: "E-mail not found",
          priority: 1,
          conditions: [CONDITIONS.EMAIL_NOT_FOUND],
        }),
        new Message({
          value: "Account suspended",
          priority: 1,
          conditions: [CONDITIONS.ACCOUNT_SUSPENDED],
        }),
        new Message({
          value: "Captcha verification failed",
          priority: 1,
          conditions: [CONDITIONS.CAPTCHA_FAILED],
        }),
        new Message({
          value: "Too many login attempts",
          priority: 2,
          conditions: [CONDITIONS.TOO_MANY_LOGIN_ATTEMPTS],
        }),
        new Message({
          value: "IP address blocked",
          priority: 4,
          conditions: [CONDITIONS.IP_BLOCKED],
        }),
        new Message({
          value: "Location anomaly detected",
          priority: 1,
          conditions: [CONDITIONS.LOCATION_ANOMALY],
        }),
        new Message({
          value: "Device unauthorized",
          priority: 3,
          conditions: [CONDITIONS.DEVICE_UNAUTHORIZED],
        }),

        // Complex condition messages (multiple conditions)
        new Message({
          value:
            "Too many attempts. If you forgot your password, try resetting it.",
          priority: 3,
          conditions: [
            CONDITIONS.WRONG_PASSWORD,
            CONDITIONS.TOO_MANY_LOGIN_ATTEMPTS,
          ],
        }),
        new Message({
          value: "Account possibly compromised",
          priority: 5, // Highest priority due to security concerns
          conditions: [
            CONDITIONS.TOO_MANY_LOGIN_ATTEMPTS,
            CONDITIONS.IP_BLOCKED,
            CONDITIONS.LOCATION_ANOMALY,
          ],
        }),
        new Message({
          value: "You can't send an e-mail to this account",
          priority: 2,
          conditions: [
            CONDITIONS.ACCOUNT_DEACTIVATED_BY_USER,
            CONDITIONS.EMAIL_DELIVERY_FAILED,
          ],
        }),
        new Message({
          value: "Maybe a bot trying to brute-force it",
          priority: 2,
          conditions: [
            CONDITIONS.CAPTCHA_FAILED,
            CONDITIONS.ACCOUNT_LOCKED_DUE_TO_FAILED_LOGINS,
          ],
        }),
      ],
      defaultMessage
    );
  }
}
