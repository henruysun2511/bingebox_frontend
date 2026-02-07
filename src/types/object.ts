import { AgePermissionTypeEnum, BaseStatusEnum, GenderEnum } from "../constants/enum";


interface BaseObject {
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    isDeleted?: boolean;
}

interface User {
    username: string,
    email: string,
    role: string,
}
export type { User };

interface Actor extends BaseObject {
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

interface Category extends BaseObject {
    _id: string;
    name: string;
}
export type { Category };

interface Movie extends BaseObject {
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
    likeCount?: number;
}
export type { Movie };

interface Cinema extends BaseObject {
    _id: string;
    name: string;
    province: string;
    description: string;
    image: string;
    location: string;
}
export type { Cinema };

interface FormatRoom {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    createdAt: string;
}
export type { FormatRoom };


interface SeatType extends BaseObject {
  _id: string;
  name: string;
  color: string;
};
export type { SeatType };

interface Seat {
  _id: string;
  room: string;
  code: string;
  row: string;
  column: number | null;
  position: {
    x: number;
    y: number;
  };
  isBlocked: boolean;
  seatType?: SeatType;
  isCoupleSeat?: boolean;
  partnerSeat?: string;
};

export type { Seat };

interface Room {
    _id: string;
    name: string;
    cinema: string | Cinema; 
    format: string | FormatRoom; 
    status: BaseStatusEnum;
    seatLayout?: {
        rows: number,
        columns: number
    };
    totalSeats?: number; 
}
export type { Room };





