import { CONDITIONS } from "./constants.js";
import { Envelope } from "./envelope.js";
import { Message } from "./message.js";

export class UserFormMailbox {
  private messages: Message[] = [];
  private envelopes: Map<number, Envelope>;

  constructor() {
    this.envelopes = new Map();

    this.messages = [
      new Message("E-mail not found", 1, [CONDITIONS.EMAIL_NOT_FOUND]),
      new Message("Account suspended", 1, [CONDITIONS.ACCOUNT_SUSPENDED]),
      new Message("Captcha verification failed", 1, [
        CONDITIONS.CAPTCHA_FAILED,
      ]),
      new Message("Too many login attempts", 2, [
        CONDITIONS.TOO_MANY_LOGIN_ATTEMPTS,
      ]),
      new Message("IP address blocked", 4, [CONDITIONS.IP_BLOCKED]),
      new Message("Location anomaly detected", 1, [
        CONDITIONS.LOCATION_ANOMALY,
      ]),
      new Message("Device unauthorized", 3, [CONDITIONS.DEVICE_UNAUTHORIZED]),
      new Message(
        "Too many attempts. If you forgot your password, try resetting it.",
        3,
        [CONDITIONS.WRONG_PASSWORD, CONDITIONS.TOO_MANY_LOGIN_ATTEMPTS]
      ),
      new Message("Account possibly compromised", 5, [
        CONDITIONS.TOO_MANY_LOGIN_ATTEMPTS,
        CONDITIONS.IP_BLOCKED,
        CONDITIONS.LOCATION_ANOMALY,
      ]),
      new Message("You can't send an e-mail to this account", 2, [
        CONDITIONS.ACCOUNT_DEACTIVATED_BY_USER,
        CONDITIONS.EMAIL_DELIVERY_FAILED,
      ]),
      new Message("Maybe a bot trying to brute-force it", 2, [
        CONDITIONS.CAPTCHA_FAILED,
        CONDITIONS.ACCOUNT_LOCKED_DUE_TO_FAILED_LOGINS,
      ]),
    ];
  }

  public sortEnvelopes() {
    for (const message of this.messages) {
      const condition = message.shiftCondition();
      if (!condition) continue;

      if (!this.envelopes.get(condition)) {
        this.envelopes.set(condition, new Envelope());
      }

      this.envelopes.get(condition).addMessage(message);
    }
  }

  public getHighestPriorityMessage(conditions: number[]): Message {
    let message: Message;

    for (const condition of conditions) {
      const envelope = this.envelopes.get(condition);
      if (!envelope) continue;

      const newMessage = envelope.getHighestPriorityMessage(conditions);
      if (!newMessage) continue;

      if (!message) {
        message = newMessage;
        continue;
      }

      if (newMessage.getPriority() > message.getPriority()) {
        message = newMessage;
      }
    }

    return message;
  }
}
