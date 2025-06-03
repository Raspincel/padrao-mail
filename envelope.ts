import { Message } from "./message";

export class Envelope {
  private message: Message;
  private envelopes: Map<number, Envelope>;
  private id: number;

  constructor() {
    this.id = Math.floor(Math.random() * 10000);
    this.envelopes = new Map();
  }

  public addMessage(message: Message) {
    const condition = message.shiftCondition();

    if (!condition) {
      this.message = message;
      return;
    }

    if (!this.envelopes.get(condition)) {
      this.envelopes.set(condition, new Envelope());
    }

    this.envelopes.get(condition).addMessage(message);
  }

  public getHighestPriorityMessage(conditions: number[]): Message {
    let message: Message = this.message;

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
