import {Ticket} from "../models/ticket.model";

export enum Pass {
    PASS_DAY = "PASS_DAY",
    PASS_WEEKEND = "PASS_WEEKEND",
    PASS_YEAR = "PASS_YEAR",
    PASS_DAYMONTH = "PASS_DAYMONTH",
    PASS_ESCAPEGAME = "PASS_ESCAPEGAME",
    PASS_NIGHT = "PASS_NIGHT"
}

export class PassDay extends Ticket {
    constructor(startYear: number, startMonth: number, startDay: number) {
        super(startYear, startMonth, startDay);
        this.name = Pass.PASS_DAY;
        this.expiration = new Date(this.start.getFullYear(), this.start.getMonth(), this.start.getDate() + 1);
    }
}

export class PassWeekend extends Ticket {
    constructor(startYear: number, startMonth: number, startDay: number) {
        super(startYear, startMonth, startDay);
        if(this.start.getDay() != 6) {
            throw new Error("The ticket is a PASS WEEKEND but it doesn't start on Saturday");
        }
        this.name = Pass.PASS_WEEKEND;
        this.expiration = new Date(startYear, startMonth, startDay + 2);
    }
}

export class PassYear extends Ticket {
    constructor(startYear: number, startMonth: number, startDay: number) {
        super(startYear, startMonth, startDay);
        this.name = Pass.PASS_YEAR;
        this.expiration = new Date(this.start.getFullYear() + 1, this.start.getMonth(), this.start.getDate());
    }
}

export class PassDayMonth extends Ticket {
    constructor(startYear: number, startMonth: number, startDay: number) {
        super(startYear, startMonth, startDay);
        this.name = Pass.PASS_DAYMONTH;
        this.expiration = new Date(this.start.getFullYear() + 1, this.start.getMonth(), 1);
    }

    validateTicket(): boolean {
        const today = new Date();
        if(this.start > today) {
            throw new Error("This ticket is not usable for now");
        }
        if(this.expiration < today) {
            throw new Error("This ticket is expired");
        }
        if(today.getHours() < 9 || today.getHours() > 19) {
            throw new Error("You can't use this ticket at this hour")
        }
        if(today.getMonth() + 1 > 11) {
            this.start = new Date(today.getFullYear() + 1, 0, 1);
            return true;
        }
        this.start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        return true;
    }
}

export class PassEscapeGame extends PassDay {
    constructor(startYear: number, startMonth: number, startDay: number) {
        super(startYear, startMonth, startDay);
        this.name = Pass.PASS_ESCAPEGAME;
    }
}

export class PassNight extends PassDay {
    constructor(startYear: number, startMonth: number, startDay: number) {
        super(startYear, startMonth, startDay);
        this.name = Pass.PASS_NIGHT;
    }

    validateTicket(): boolean {
        const today = new Date();
        if(this.start > today) {
            throw new Error("This ticket is not usable for now");
        }
        if(this.expiration < today) {
            throw new Error("This ticket is expired");
        }
        if(today.getHours() < 21 || today.getHours() > 2) {
            throw new Error("You can't use this ticket at this hour")
        }
        return true;
    }
}