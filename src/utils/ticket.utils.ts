export enum Pass {
    PASS_DAY = "PASS_DAY",
    PASS_WEEKEND = "PASS_WEEKEND",
    PASS_YEAR = "PASS_YEAR",
    PASS_DAYMONTH = "PASS_DAYMONTH",
    PASS_ESCAPEGAME = "PASS_ESCAPEGAME",
    PASS_NIGHT = "PASS_NIGHT"
}

export const pass = [
    Pass.PASS_DAY,
    Pass.PASS_WEEKEND,
    Pass.PASS_YEAR,
    Pass.PASS_DAYMONTH,
    Pass.PASS_ESCAPEGAME,
    Pass.PASS_NIGHT
];

export function checkConversionToPass(name: string): boolean {
    for(let i=0; i<pass.length; i++) {
        if(pass[i] == name) {
            return true;
        }
    }
    return false;
}