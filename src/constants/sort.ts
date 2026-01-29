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