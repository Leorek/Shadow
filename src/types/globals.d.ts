// globals.d.ts
declare interface Command {
    name: string;
    description: string;
    execute: (message, args) => void;
}