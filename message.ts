export class Message {
  private priority: number;
  private conditions: number[];
  private next: Message | null;
  private value: string;

  constructor(value: string, priority: number, conditions: number[]) {
    this.priority = priority;
    this.conditions = conditions;
    this.next = null;
    this.value = value;
  }

  public shiftCondition(): number {
    return this.conditions.shift();
  }

  public getValue(): string {
    return this.value;
  }

  public getConditions(): number[] {
    return [...this.conditions];
  }

  public getPriority(): number {
    return this.priority;
  }
}
