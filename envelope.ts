import { Message } from "./message";

export class Envelope {
  protected message: Message | null = null;
  protected envelopes: Map<number, Envelope> = new Map();
  protected defaultErrorMessage: Message | null = null;

  constructor(defaultErrorMessage?: Message) {
    this.defaultErrorMessage = defaultErrorMessage || null;
  }

  public setDefaultErrorMessage(message: Message): void {
    this.defaultErrorMessage = message;
  }

  public addMessage(message: Message): void {
    const condition = message.shiftCondition();

    if (!condition) {
      this.message = message;
      return;
    }

    if (!this.envelopes.get(condition)) {
      this.envelopes.set(condition, new Envelope(this.defaultErrorMessage));
    }

    this.envelopes.get(condition).addMessage(message);
  }

  public getHighestPriorityMessage(conditions: number[]): Message | null {
    let message = this.message;

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

    return message || this.defaultErrorMessage;
  }
}
