import { Pagination } from "./param";

interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    pagination?: Pagination;
}

export type { ApiResponse };

export interface UserJwtDecode {
    sub: string;
    username: string;
    role: string;
    isPremium: boolean;
    exp: number;
    iat: number;
    jti: string;
    avatar?: string;
}

interface LoginResponse {
    username: string;
    role: string;
    avatar?: string;
    accessToken: string;
}
export type { LoginResponse };

interface LoginBody {
    username: string;
    password: string;
};
export type { LoginBody };

interface BookingBody {
    showtimeId: string;
    seatIds: string[];
    foods: {
        foodId: string;
        quantity: number;
    }[];
    voucherCode?: string;
    pointsUsed?: number;
}
export type { BookingBody };

