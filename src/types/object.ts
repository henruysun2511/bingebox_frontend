import { GenderEnum } from "./enum";

interface User {
    username: string,
    email: string,
    role: string,
}
export type { User };

interface Actor {
    _id: string;
    name: string;
    avatar: string;
    gender?: GenderEnum;
    nationality?: string;
    bio?: string;
}
export type { Actor };

interface Upload {
    url: string;
    publicId?: string;
}
export type { Upload };

interface Category {
    _id: string;
    name: string;
}
export type { Category };

interface Movie {
    _id: string;
    name: string;
}
export type { Movie };

