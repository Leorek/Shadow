export interface ICommand {
    data: any;
    execute(...args: any[]): void;
}