import { AgePermissionTypeEnum, BaseStatusEnum, MovieStatusEnum, SubtitleTypeEnum } from "./enum";

export const SUBTITLE_TYPE_OPTIONS = [
  {
    value: SubtitleTypeEnum.DUBBING,
    label: "Lồng tiếng",
    className: "bg-blue-600/20 text-blue-400 border-blue-800",
  },
  {
    value: SubtitleTypeEnum.SUBTITLE,
    label: "Phụ đề",
    className: "bg-purple-600/20 text-purple-400 border-purple-800",
  },
  {
    value: SubtitleTypeEnum.NONE,
    label: "Không có",
    className: "bg-emerald-600/20 text-emerald-400 border-emerald-800",
  },
];

export const MOVIE_STATUS_OPTIONS = [
  {
    value: MovieStatusEnum.NOW_SHOWING,
    label: "Đang chiếu",
    className: "bg-green-600 text-white border-none",
  },
  {
    value: MovieStatusEnum.COMING_SOON,
    label: "Sắp chiếu",
    className: "bg-blue-600 text-white border-none",
  },
  {
    value: MovieStatusEnum.ENDED,
    label: "Đã kết thúc",
    className: "bg-red-600 text-white border-none",
  },
];

export const BASE_STATUS_LABEL = [
  {
    value: BaseStatusEnum.ACTIVE,
    label: "Hoạt động"
  },
  {
    value: BaseStatusEnum.INACTIVE,
    label: "Tạm dừng"
  }
];

export const AGE_PERMISSION_OPTIONS = [
    {
        value: AgePermissionTypeEnum.P,
        label: "P - Mọi độ tuổi",
        shortLabel: "P",
        className: "border-green-500 text-green-500 bg-green-500/10",
    },
    {
        value: AgePermissionTypeEnum.K,
        label: "K - Dưới 13 tuổi với người giám hộ",
        shortLabel: "K",
        className: "border-yellow-500 text-yellow-500 bg-yellow-500/10",
    },
    {
        value: AgePermissionTypeEnum.T13,
        label: "T13 - Trên 13 tuổi",
        shortLabel: "T13",
        className: "bg-orange-500 text-white border-none",
    },
    {
        value: AgePermissionTypeEnum.T16,
        label: "T16 - Trên 16 tuổi",
        shortLabel: "T16",
        className: "border-purple-500 text-purple-500 bg-purple-500/10",
    },
    {
        value: AgePermissionTypeEnum.T18,
        label: "T18 - Trên 18 tuổi",
        shortLabel: "T18",
        className: "border-red-500 text-red-500 bg-red-500/10",
    },
];

export const MOVIE_FORMATS = ["2D", "3D", "IMAX"] as const;

