import { AgePermissionTypeEnum, BaseStatusEnum, BookingStatusEnum, DayOfWeekEnum, GenderEnum, LoginTypeEnum, MovieStatusEnum, PermissionMethodTypeEnum, TicketStatusEnum } from "../constants/enum";


interface BaseObject {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    isDeleted: boolean;
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
    banner?: string;
    tags?: string[];
}
export type { User };

interface Membership extends BaseObject {
    _id: string;
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
    status: MovieStatusEnum;
    format?: string[];
    likes: string[];
    isLiked: boolean;
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
    price: number;
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
    status: string;
}
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

interface ShowtimeCinema {
    id: string;
    poster: string;
    duration: number;
    agePermission: string;
    format: string[];
    releaseDate?: string;
    description?: string;
}
export type { ShowtimeCinema };

interface ShowtimeDetail extends BaseObject {
    _id: string;
    movie: Movie;
    room: {
        _id: string;
        name: string;
        cinema: {
            _id: string;
            name: string;
        }
        format: {
            _id: string;
            name: string;
        }
    };
    timeslot: TimeSlot;
    startTime: Date;
    endTime: Date;
    status: BaseStatusEnum;
}
export type { ShowtimeDetail };

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


interface Permission extends BaseObject {
    name: string;
    method: PermissionMethodTypeEnum,
    path: string;
    module: string;
    description?: string;
}
export type { Permission };

interface Role extends BaseObject {
    _id: string;
    name: string;
    description: string;
    permissions: Permission[];
}
export type { Role };

interface AgeType extends BaseObject {
    _id: string;
    name: string;
    minAge: number;
    maxAge: number;
}
export type { AgeType };

interface TicketPrice extends BaseObject {
    _id: string;
    timeSlot: TimeSlot;
    ageType: AgeType;
    formatRoom: FormatRoom;
    seatType: SeatType;
    dayOfWeek: DayOfWeekEnum;
    finalPrice: number;
}
export type { TicketPrice };

interface Food extends BaseObject {
    _id: string;
    name: string;
    image: string;
    price: number;
}
export type { Food };

interface Voucher {
    _id: string;
    name: string;             // Tên voucher
    code: string;             // Mã code (đã uppercase)
    description?: string;     // Mô tả thêm
    startTime: string;        // Ngày bắt đầu (ISO string)
    endTime: string;          // Ngày kết thúc (ISO string)
    minOrderValue: number;    // Giá trị đơn hàng tối thiểu
    maxDiscountAmount: number; // Số tiền giảm tối đa
    maxUsage: number;         // Tổng số lượt sử dụng tối đa
    usedCount: number;        // Số lượt đã sử dụng (thường backend sẽ trả về)
    status: BaseStatusEnum;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
export type { Voucher };

interface Blog extends BaseObject {
    _id: string
    title: string
    slug: string
    content: string
    thumbnail: string
    author: {
        _id: string
        username: string
        avatar: string
    }
    views: number
    isPublished: boolean
}
export type { Blog };

interface Booking extends BaseObject {
    _id: string;
    userId: string;
    showtime: string;
    foods: {
        foodId: string;
        quantity: number;
        priceAtBooking: number;
    }[];
    voucher?: string;
    pointsUsed?: number; // Số điểm khách quyết định dùng cho đơn này
    pointsEarned?: number; // Số điểm khách sẽ nhận được sau khi thanh toán thành công
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    bookingStatus: BookingStatusEnum; // PENDING, SUCCESS, FAILED, EXPIRED
    expiresAt: Date; // Thời hạn thanh toán để giữ ghế
}

export type { Booking };

interface Ticket extends BaseObject {
    _id: string;
    booking: string;
    showtime: string;
    seat: string;
    ticketPrice: string;
    price: number;
    qrCode: string;
    status: TicketStatusEnum;
    expiresAt: Date;
}

export type { Ticket };

interface BookingDetail extends BaseObject {
    showtime: any; 
    step: number;
    selectedSeats: Seat[];
    selectedFoods: Food[];
    selectedVoucher: Voucher | null;
    booking: any;
    tickets: Ticket[];
    pointsUsed: number;
}

export type { BookingDetail };

interface TicketUser {
  _id: string;
  showtime: {
    _id: string;
    movie: {
      _id: string;
      name: string;
      subtitle: string[];
    };
    room: {
      _id: string;
      name: string;
      cinema: {
        _id: string;
        name: string;
      };
    };
    startTime: string;
  };
  seat: {
    _id: string;
    code: string;
  };
  qrCode: string;
  createdAt: string;
}
export type { TicketUser };

interface Comment extends BaseObject {
    user: string;
    movie: string;
    content: string;
    rating: number;
    likesCount: number;
    replyCount: number;
    parent?: string;
    likes: string[];
}
export type { Comment };

interface BookingAdmin {
    _id: string;
    userId: {
        _id: string;
        username: string;
        email: string;
        fullName: string;
    };
    finalAmount: number;
    bookingStatus: BookingStatusEnum;
    createdAt: string;
}
export type { BookingAdmin };

interface TicketDetail {
  _id: string;
  isDeleted: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  booking: string;
  showtime: any;
  seat: Seat;
  ticketPrice: string;
  price: number;
  qrCode: string;
  status: TicketStatusEnum;
  expiresAt: string | null;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export type { TicketDetail };


// Chart
interface MembershipDistribution {
  count: number;
  name: string;
}
export type { MembershipDistribution };

interface TicketSale {
  soldTickets: number;
  time: string; 
}
export type { TicketSale };

interface ShowtimeSale {
  ticketCount: number;
  timeSlot: string;
}
export type { ShowtimeSale };

interface TopMovie {
  movieId: string;
  name: string;
  poster: string;
  revenue: number;
}
export type { TopMovie };

interface TopCustomer {
  _id: string;
  email: string;
  fullName?: string;
  avatar?: string;
  membership: Membership | null;
  totalSpending: number;
}
export type { TopCustomer };

interface GeneralStat {
  totalRevenue: number;
  totalTickets: number;
  totalMovies: number;
}
export type { GeneralStat };







