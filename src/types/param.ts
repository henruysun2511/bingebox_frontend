
interface Pagination {
  page?: number;
  limit?: number;
  totalPages?: number;
  totalElements?: number;
}
export type { Pagination };

interface ActorParams extends Pagination {
  name?: string;
  sort?: string;
}
export type { ActorParams };

interface MovieParams extends Pagination {
  name?: string;
  status?: string;
  categoryIds?: string[];
  agePermission?: string;
  releaseDate?: string;
  sort?: string;
}
export type { MovieParams };

interface CinemaParams extends Pagination {
  name?: string;
  province?: string;
  sort?: string;
}
export type { CinemaParams };

interface FormatRoomParams extends Pagination {

}
export type { FormatRoomParams };

interface RoomParams extends Pagination {
  name?: string;
  cinemaId?: string;
}
export type { RoomParams };

interface ShowtimeParams extends Pagination {
  movieId?: string;
  roomId?: string;
  date?: Date;
}
export type { ShowtimeParams };

interface RoleParams {
  name?: string;
}
export type { RoleParams };

interface PermissionParams extends Pagination {
  name?: string;
  path?: string;
  method?: string;
}
export type { PermissionParams };


interface AgeTypeParams {
  name?: string;
  age?: string;
}
export type { AgeTypeParams };

interface UserParams extends Pagination {
  username?: string;
  isBlocked?: string;
  role?: string;
  sort?: string;
}
export type { UserParams };

interface TicketPriceParams extends Pagination {
  timeSlot?: string;
  ageType?: string;
  formatRoom?: string;
  seatType?: string;
  dayOfWeek?: string;
  minPrice?: number;
  maxPrice?: number;
}
export type { TicketPriceParams };

interface FoodParams extends Pagination {
    name?: string;
    minPrice?: string;
    maxPrice?: string;
}
export type { FoodParams };

