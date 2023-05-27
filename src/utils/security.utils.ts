import * as crypto from "crypto";
import { Response } from "express";

export class SecurityUtils {

    public static toSHA512(str: string): string {
        const hash = crypto.createHash('sha512');
        hash.update(str);
        return hash.digest('hex');
    }

    public static checkIfIdIsCorrect(id: string, res:Response): boolean {
        if(!RegExp(/^[0-9a-fA-F]{24}$/).exec(id)) {
            res.status(400).end();
            return false;
        }
        return true;
    }

}