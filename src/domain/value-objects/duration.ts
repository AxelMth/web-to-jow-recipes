export class Duration {
  constructor(private readonly minutes: number) {}

  static fromPTFormat(ptString: string): Duration {
    const minutes = parseInt(ptString.replace('PT', '').replace('M', ''));
    return new Duration(minutes);
  }

  toMinutes(): number {
    return this.minutes;
  }
}