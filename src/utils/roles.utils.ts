import { User } from "../models";

export enum Roles {
    ADMIN = "admin",
    VETERINARIAN = "veterinarian",
    ANIMAL_CARETAKER = "animal_caretaker",
    MAINTENANCE_WORKER = "maintenance_worker",
    TICKET_SELLER = "ticket_seller",
    RECEPTION_STAFF = "reception_staff",
    GUEST = "guest"
}

export const roles = [
    Roles.ADMIN,
    Roles.VETERINARIAN,
    Roles.ANIMAL_CARETAKER,
    Roles.MAINTENANCE_WORKER,
    Roles.TICKET_SELLER,
    Roles.RECEPTION_STAFF,
    Roles.GUEST
];


export function checkUserRole(user:User, requiredRole: Roles): boolean {    
    if (user.roles.some(role => {
        return typeof role === "object" && role.name === requiredRole;
    })) {
        return true;
    }

    return false;
}