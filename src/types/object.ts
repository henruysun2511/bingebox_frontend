import { AgePermissionTypeEnum, GenderEnum } from "../constants/enum";

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
  duration: number;
  releaseDate: string;
  director?: string;
  description: string;
  subtitle: string;
  poster: string;
  banner: string;
  trailer: string;
  actors: string[]; 
  categories: string[]; 
  nationality?: string;
  agePermission: AgePermissionTypeEnum;
  status: AgePermissionTypeEnum;
  format?: string[];
  createdAt: string;
  likeCount?: number;
}
export type { Movie };

