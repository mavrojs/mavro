export interface CLICommand {
  name: string;
  description: string;
  options?: Record<string, any>;
  execute: (args: any[]) => Promise<void>;
}
