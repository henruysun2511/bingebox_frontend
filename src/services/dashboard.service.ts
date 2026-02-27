import { ApiResponse } from "@/types/body";
import { GeneralStat, MembershipDistribution, ShowtimeSale, TicketSale, TopCustomer, TopMovie } from "@/types/object";
import { DateFilterParams } from "@/types/param";
import http from "@/utils/http";


const prefix = "dashboards";

export const DashboardService = {
   getGeneralStats: () => 
    http.get<ApiResponse<GeneralStat>>(`/${prefix}/general-stats`),
  // Top 5 phim bán chạy 
  getRevenue: (params?: DateFilterParams) => 
    http.get<ApiResponse<any>>(`/${prefix}/revenue`, { params }),

  // Tổng doanh thu theo tháng 
  getTicketSale: (params?: DateFilterParams) => 
    http.get<ApiResponse<TicketSale[]>>(`/${prefix}/ticket-sales`, { params }),

  // Top phim doanh thu cao
  getTopMovies: (params?: DateFilterParams) => 
    http.get<ApiResponse<TopMovie[]>>(`/${prefix}/top-movies`, { params }),

  // Top 5 khách hàng chi tiêu nhiều nhất 
  getTopCustomers: () => 
    http.get<ApiResponse<TopCustomer[]>>(`/${prefix}/top-customers`),

  // Số lượng user đăng kí mỗi tháng 
  getCustomerGrowth: (params?: DateFilterParams) => 
    http.get<ApiResponse<any>>(`/${prefix}/customer-growth`, { params }),

  // Số lượng mỗi membership
  getMembershipDistribution: () => 
    http.get<ApiResponse<MembershipDistribution[]>>(`/${prefix}/membership-distribution`),

  // Số lượng vé theo khung giờ 
  getShowtimeSales: (params?: DateFilterParams) => 
    http.get<ApiResponse<ShowtimeSale[]>>(`/${prefix}/showtime-sales`, { params }),

  // Tỷ lệ lấp đầy phòng 
  getOccupancyRate: () => 
    http.get<ApiResponse<any>>(`/${prefix}/occupancy`),
};