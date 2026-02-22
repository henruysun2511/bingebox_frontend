export type MovieSortType =
  | "createdAt"
  | "name"
  | "-name"
  | "releaseDate";

export const MOVIE_SORT_OPTIONS: {
  value: MovieSortType;
  label: string;
}[] = [
  { value: "createdAt", label: "Mới nhất" },
  { value: "name", label: "Tên A → Z" },
  { value: "-name", label: "Tên Z → A" },
  { value: "releaseDate", label: "Ngày chiếu gần nhất" },
];

export type ActorSortType =
  | "createdAt"
  | "name"
  | "-name"

export const ACTOR_SORT_OPTIONS: {
  value: ActorSortType;
  label: string;
}[] = [
  { value: "createdAt", label: "Mới nhất" },
  { value: "name", label: "Tên A → Z" },
  { value: "-name", label: "Tên Z → A" },
];

export type CinemaSortType =
| "createdAt"
| "name"
| "-name"

export const CINEMA_SORT_OPTIONS: {
  value: ActorSortType;
  label: string;
}[] = [
  { value: "createdAt", label: "Mới nhất" },
  { value: "name", label: "Tên A → Z" },
  { value: "-name", label: "Tên Z → A" },
];

export type UserSortType =
| "createdAt"
| "username"
| "-username"
| "totalSpending"
| "-totalSpending"

export const USER_SORT_OPTIONS: {
  value: UserSortType;
  label: string;
}[] = [
  { value: "createdAt", label: "Mới nhất" },
  { value: "username", label: "Tên A → Z" },
  { value: "-username", label: "Tên Z → A" },
  { value: "totalSpending", label: "Chi tiêu thấp → cao" },
  { value: "-totalSpending", label: "Chi tiêu cao → thấp" },
];