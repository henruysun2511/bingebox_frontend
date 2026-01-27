import { AgePermissionTypeEnum } from "./enum";

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
  categoryIds: string;
  agePermission: AgePermissionTypeEnum;
  releaseDate?: Date;
}
export type { MovieParams };


