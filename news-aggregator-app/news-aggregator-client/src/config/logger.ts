class Logger {
  public info(message: string, ...args: any[]): void {
    console.log(message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    console.error(message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    console.warn(message, ...args);
  }
}

export default new Logger();