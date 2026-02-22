import { AgePermissionTypeEnum, BaseStatusEnum, GenderEnum, LoginTypeEnum, PermissionMethodTypeEnum } from "../constants/enum";


interface BaseObject {
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    isDeleted?: boolean;
}

interface User {
    _id: string;
    username: string,
    email: string,
    role: Role,
    fullName?: string;
    avatar?: string;
    birth?: Date;
    gender?: GenderEnum;
    googleId?: string;
    provider?: LoginTypeEnum;
    membership?: Membership;
    currentPoints: number;
    totalSpending: number;
    isBlocked: boolean;
}
export type { User };

interface Membership extends BaseObject {
    _id?: string;
    name: string; // "Silver", "Gold", "Diamond"
    minSpending: number; // Số tiền tối thiểu đã tiêu để đạt hạng này
    pointAccumulationRate: number; // Tỷ lệ tích điểm (VD: 0.05 tức là tích 5% giá trị đơn)
    discountRate: number; // Giảm giá trực tiếp cho thành viên (VD: 0.02 tức giảm 2%)
}
export type { Membership };


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
    subtitle: string[];
    poster: string;
    banner: string;
    trailer: string;
    actors: string[];
    categories: Category[];
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

interface Showtime extends BaseObject {
    _id?: string;
    movie: string;
    room: string;
    subtitle: string;
    startTime: Date
    endTime: Date
    status: BaseStatusEnum
    timeslot: string;
}

export type { Showtime };

interface ShowtimeRoom {
    _id: string;
    roomName: string;
    showtimes:
    {
        _id: string;
        movie: Movie;
        startTime: string,
        endTime: string,
        status: BaseStatusEnum.ACTIVE,
        subtitle: string
    }[]
}
export type { ShowtimeRoom };

interface ShowtimeMovie {
    _id: string,
    name: string,
    address: string,
    formats:
    {
        format: string,
        showtimes: Showtime[]
    }[]
}
export type { ShowtimeMovie };

interface TimeSlot extends BaseObject {
    _id?: string,
    name: string,
    startTime: string,
    endTime: string,
}

export type { TimeSlot };

interface Setting extends BaseObject {
    logo: string;
    name: string;
    company: string;
    email: string;
    address: string;
    hotline: string;
    workHours?: string;
    social?: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
        zalo?: string;
    }
    banner?: string[];
    popup: [
        {
            image: string,
            link: string,
            isActive: BaseStatusEnum
        }
    ]
    metaTitle: string,
    metaDescription: string,
}
export type { Setting };


interface Permission{
    name: string;
    method: PermissionMethodTypeEnum,
    path: string;
    module: string;
    description?: string;
}
export type { Permission };

interface Role{
    _id: string;
    name: string;
    description: string;
    permissions: Permission[];
}
export type { Role };

interface AgeType {
  name: string;
  minAge: number;
  maxAge: number;
}
export type { AgeType };




