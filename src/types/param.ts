
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

interface RoleParams extends Pagination {
  name?: string;
}
export type { RoleParams };

interface PermissionParams extends Pagination {
  name?: string;
  path?: string;
  method?: string;
}
export type { PermissionParams };

