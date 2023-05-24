import {Ticket} from "../models/ticket.model";

export enum Pass {
    PASS_DAY = "PASS_DAY",
    PASS_WEEKEND = "PASS_WEEKEND",
    PASS_YEAR = "PASS_YEAR",
    PASS_DAYMONTH = "PASS_DAYMONTH",
    PASS_ESCAPEGAME = "PASS_ESCAPEGAME",
    PASS_NIGHT = "PASS_NIGHT"
}

export class PassDay implements Ticket {
    name: Pass;
    start: Date;
    expiration: Date;

    constructor(start: Date) {
        this.name = Pass.PASS_DAY;
        this.start = start;
        this.expiration = new Date(Date.now());
    }
}

export class PassWeek implements Ticket {
    expiration: Date;
    name: Pass;
    start: Date;

    constructor(start: Date) {
        this.name = Pass.PASS_WEEKEND;
        this.start = start;
        this.expiration = new Date(start.getFullYear(), start.getMonth(), start.getDay() + 1);
    }
}

export class PassYear implements Ticket {
    expiration: Date;
    name: Pass;
    start: Date;

    constructor(year: number) {
        this.name = Pass.PASS_YEAR;
        this.start = new Date(year, Date.now());
        this.expiration = new Date(year + 1, Date.now());
    }
}

export class PassDayMonth implements Ticket {
    expiration: Date;
    name: Pass;
    start: Date;

    constructor(year: number) {
        this.name = Pass.PASS_DAYMONTH;
        this.start = new Date(year, Date.now());
        this.expiration = new Date(year + 1, Date.now());
    }
}

export class PassEscapeGame extends PassDay {
    constructor(start: Date) {
        super(start);
        this.name = Pass.PASS_ESCAPEGAME;
    }
}

export class PassNight extends PassDay {
    constructor(start: Date) {
        super(start);
        this.name = Pass.PASS_NIGHT;
    }
}