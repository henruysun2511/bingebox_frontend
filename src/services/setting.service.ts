import { SettingInput } from "@/schemas/setting.schema";
import { ApiResponse } from "@/types/body";
import { Setting } from "@/types/object";
import http from "@/utils/http";

const prefix = "setting";

export const SettingService = {
    getSettings() {
        return http.get<ApiResponse<Setting>>(`/${prefix}`);
    },
    update(payload: SettingInput) {
        return http.patch<ApiResponse<any>>(`/${prefix}`, payload);
    },
};