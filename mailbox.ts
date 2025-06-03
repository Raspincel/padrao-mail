import { CONDITIONS } from "./constants.js";
import { Envelope } from "./envelope.js";
import { Message } from "./message.js";

export class Mailbox {
  private messages: Message[] = [];
  private envelopes: Map<number, Envelope>;

  constructor() {
    this.envelopes = new Map();

    this.messages = [
      new Message("M1", 1, [1]),
      new Message("M1", 2, [2, 9]),
      new Message("M1", 3, [6]),
      new Message("M1", 1, [3, 4]),
      new Message("M1", 4, [1, 5]),
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
