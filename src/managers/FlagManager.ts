import { UserFlags } from "../types/global.interface";

class FlagManager {
    private flags: number;

    constructor(initialFlags: number = 0) {
        this.flags = initialFlags;
    }

    add(flag: UserFlags): UserFlags {
        return this.flags |= flag;
    }

    remove(flag: UserFlags): UserFlags {
        return this.flags &= ~flag;
    }

    has(flag: UserFlags): boolean {
        return (this.flags & flag) === flag;
    }

    list(): string[] {
        const setFlags: string[] = [];
        for (const flag in UserFlags) {
            if (!isNaN(Number(flag))) {
                if (this.has(Number(flag))) {
                    setFlags.push(UserFlags[flag]);
                }
            }
        }
        return setFlags;
    }

}

export default FlagManager;