/**
 * Represents a message in the messaging system.
 * This class encapsulates message content, priority level, and associated conditions.
 */
export class Message {
  /**
   * Priority of the message - higher numbers indicate higher priority
   * Used to determine which message to show when multiple conditions match
   */
  private priority: number;
  
  /**
   * Array of condition codes this message applies to
   * Each number represents a specific condition (like "email not found" or "account suspended")
   */
  private conditions: number[];
  
  /**
   * The actual text content of the message to be displayed
   */
  private value: string;

  constructor({conditions, priority, value}: {value: string, priority: number, conditions: number[]}) {
    this.priority = priority;
    this.conditions = conditions;
    this.value = value;
  }

  /**
   * Removes and returns the first condition from the conditions array
   * Used during message routing to determine which envelope should contain this message
   * @returns {number} The first condition code, or undefined if no conditions remain
   */
  public shiftCondition(): number {
    return this.conditions.shift();
  }

  /**
   * Gets the text content of this message
   * @returns {string} The message text
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Gets a copy of all conditions associated with this message
   * Returns a new array to prevent modification of the internal state
   * @returns {number[]} Array of condition codes
   */
  public getConditions(): number[] {
    return [...this.conditions];
  }

  /**
   * Gets the priority level of this message
   * @returns {number} The priority value
   */
  public getPriority(): number {
    return this.priority;
  }
}
