import * as crypto from "crypto";

export class SecurityUtils {

    public static toSHA512(str: string): string {
        const hash = crypto.createHash('sha512');
        hash.update(str);
        return hash.digest('hex');
    }

    public static checkIfIdIsCorrect(id: string): void {
        if(!RegExp(/^[0-9a-fA-F]{24}$/).test(id)) {                        
            throw new Error("Id is not correct");
        }
    }

}