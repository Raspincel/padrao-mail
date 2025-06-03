import { Message } from "./message";

/**
 * The Envelope class implements a hierarchical structure for organizing messages by conditions.
 * It functions as both a composite and a chain of responsibility pattern.
 */
export class Envelope {
  /**
   * Direct message stored in this envelope, used when all conditions are met
   * Can be null if this envelope only contains other envelopes
   */
  protected message: Message | null = null;
  
  /**
   * Map of sub-envelopes organized by condition code
   * Each key represents a condition, and the value is another envelope handling that condition
   */
  protected envelopes: Map<number, Envelope> = new Map();
  /**
   * Adds a message to the envelope structure, organizing it based on its conditions
   * If the message has no conditions, it's stored directly in this envelope
   * If it has conditions, it's routed to the appropriate sub-envelope
   * @param {Message} message - The message to add
   */
  public addMessage(message: Message): void {
    // Take the first condition from the message
    const condition = message.shiftCondition();

    // If no conditions left, store message directly in this envelope
    if (!condition) {
      this.message = message;
      return;
    }

    // Create a new sub-envelope for this condition if it doesn't exist
    if (!this.envelopes.get(condition)) {
      this.envelopes.set(condition, new Envelope());
    }

    // Route the message to the appropriate sub-envelope
    this.envelopes.get(condition).addMessage(message);
  }

  /**
   * Finds the highest priority message that matches any of the given conditions
   * Uses a hierarchical search through the envelope structure
   * @param {number[]} conditions - Array of condition codes to match against
   * @returns {Message|null} The highest priority matching message, or null if none found
   */
  public getHighestPriorityMessage(conditions: number[]): Message | null {
    // Start with the direct message in this envelope
    let message = this.message;

    // Check each condition against our sub-envelopes
    for (const condition of conditions) {
      const envelope = this.envelopes.get(condition);
      if (!envelope) continue;

      // Recursively search for messages in the sub-envelope
      const newMessage = envelope.getHighestPriorityMessage(conditions);
      if (!newMessage) continue;

      // If we haven't found a message yet, use this one
      if (!message) {
        message = newMessage;
        continue;
      }

      // Replace current message if the new one has higher or equal priority
      if (newMessage.getPriority() >= message.getPriority()) {
        message = newMessage;
      }
    }

    // Return the best matching message or null
    return message;
  }
}
