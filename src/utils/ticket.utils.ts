import {Ticket} from "../models/ticket.model";

export enum Pass {
    PASS_DAY = "PASS_DAY",
    PASS_WEEKEND = "PASS_WEEKEND",
    PASS_YEAR = "annuel",
    PASS_DAYMONTH = "un jour par mois toute l'année",
    PASS_ESCAPEGAME = "escape game",
    PASS_NIGHT = "night"
}

export class PassDay implements Ticket {
    name: Pass;
    start: Date;
    expiration: Date;

    constructor(start: Date) {
        this.name = Pass.PASS_DAY;
        this.start = start;
        this.expiration = start.getDay()+1;
    }
}

export class PassWeek implements Ticket {
    expiration: Date;
    name: Pass;
    start: Date;

    constructor(start: Date) {
        this.name = Pass.PASS_WEEKEND;
        this.start = start;
        this.expiration = start.getDay() + 1;
    }
}

export class PassYear implements Ticket {
    expiration: Date;
    name: Pass;
    start: Date;

    constructor(year: number) {
        this.name = Pass.PASS_YEAR;
        this.start = new Date(year, Date.now())
    }
}