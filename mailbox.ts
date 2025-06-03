import { CONDITIONS } from "./constants.js";
import { Envelope } from "./envelope.js";
import { Message } from "./message.js";

export class Mailbox extends Envelope {
  constructor(messages?: Message[], defaultErrorMessage?: string) {
    // Create default error message
    const errorMsg = new Message({
      value: defaultErrorMessage || "No matching condition found",
      priority: 0,
      conditions: []
    });

    // Initialize parent with error message
    super(errorMsg);

    // Add all messages
    if (messages) {
      this.addMessages(messages);
    } else {
      // Default example messages if none provided
      this.addMessages([
        new Message({ value: "M1", priority: 1, conditions: [1] }),
        new Message({ value: "M1", priority: 2, conditions: [2, 9] }),
        new Message({ value: "M1", priority: 3, conditions: [6] }),
        new Message({ value: "M1", priority: 1, conditions: [3, 4] }),
        new Message({ value: "M1", priority: 4, conditions: [1, 5] }),
      ]);
    }
  }

  public addMessages(messages: Message[]): void {
    for (const message of messages) {
      this.addMessage(message);
    }
  }

  public sortEnvelopes(): void {
    // This is now handled automatically when adding messages
    // Method kept for backward compatibility
  }

  // Factory method for creating a form mailbox with predefined messages
  public static createFormMailbox(defaultErrorMessage?: string): Mailbox {
    return new Mailbox(
      [
        new Message({ value: "E-mail not found", priority: 1, conditions: [CONDITIONS.EMAIL_NOT_FOUND] }),
        new Message({ value: "Account suspended", priority: 1, conditions: [CONDITIONS.ACCOUNT_SUSPENDED] }),
        new Message({ value: "Captcha verification failed", priority: 1, conditions: [CONDITIONS.CAPTCHA_FAILED] }),
        new Message({ value: "Too many login attempts", priority: 2, conditions: [CONDITIONS.TOO_MANY_LOGIN_ATTEMPTS] }),
        new Message({ value: "IP address blocked", priority: 4, conditions: [CONDITIONS.IP_BLOCKED] }),
        new Message({ value: "Location anomaly detected", priority: 1, conditions: [CONDITIONS.LOCATION_ANOMALY] }),
        new Message({ value: "Device unauthorized", priority: 3, conditions: [CONDITIONS.DEVICE_UNAUTHORIZED] }),
        new Message({
          value: "Too many attempts. If you forgot your password, try resetting it.",
          priority: 3,
          conditions: [CONDITIONS.WRONG_PASSWORD, CONDITIONS.TOO_MANY_LOGIN_ATTEMPTS]
        }),
        new Message({ 
          value: "Account possibly compromised", 
          priority: 5, 
          conditions: [
            CONDITIONS.TOO_MANY_LOGIN_ATTEMPTS,
            CONDITIONS.IP_BLOCKED,
            CONDITIONS.LOCATION_ANOMALY,
          ]
        }),
        new Message({ 
          value: "You can't send an e-mail to this account", 
          priority: 2, 
          conditions: [
            CONDITIONS.ACCOUNT_DEACTIVATED_BY_USER,
            CONDITIONS.EMAIL_DELIVERY_FAILED,
          ]
        }),
        new Message({ 
          value: "Maybe a bot trying to brute-force it", 
          priority: 2, 
          conditions: [
            CONDITIONS.CAPTCHA_FAILED,
            CONDITIONS.ACCOUNT_LOCKED_DUE_TO_FAILED_LOGINS,
          ]
        }),
      ],
      defaultErrorMessage
    );
  }
}
