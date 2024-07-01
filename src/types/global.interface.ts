export enum UserFlags {
    DEVELOPER = 1 << 0,
    MODERATOR = 1 << 1,
    SUPPORTER = 1 << 2,
    FRIEND = 1 << 3,
}

export interface MojangAccount {
    id: string;
    name: string;
    [key: string]: any;
}