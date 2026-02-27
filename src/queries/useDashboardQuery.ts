import { DashboardService } from "@/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";

const DASHBOARD_QUERY_KEY = ["dashboards"];

const fetcher = (fn: any, params?: any) => async () => {
  const res = await fn(params);
  return res.data;
};

export const useGeneralStat = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "general-stats"],
    queryFn: fetcher(DashboardService.getGeneralStats),
  });
};

export const useRevenue = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "revenue", params],
    queryFn: fetcher(DashboardService.getRevenue, params),
  });
};

export const useTicketSale = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "ticket-sales", params],
    queryFn: fetcher(DashboardService.getTicketSale, params),
  });
};

// 3. Top phim doanh thu cao
export const useTopMovies = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "top-movies", params],
    queryFn: fetcher(DashboardService.getTopMovies, params),
  });
};

// 4. Top 5 khách hàng chi tiêu nhiều nhất
export const useTopCustomers = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "top-customers"],
    queryFn: fetcher(DashboardService.getTopCustomers),
  });
};

// 5. Số lượng user đăng kí mỗi tháng
export const useCustomerGrowth = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "customer-growth", params],
    queryFn: fetcher(DashboardService.getCustomerGrowth, params),
  });
};

// 6. Số lượng mỗi membership
export const useMembershipDistribution = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "membership-distribution"],
    queryFn: fetcher(DashboardService.getMembershipDistribution),
  });
};

// 7. Số lượng vé theo khung giờ
export const useShowtimeSales = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "showtime-sales", params],
    queryFn: fetcher(DashboardService.getShowtimeSales, params),
  });
};

// 8. Tỷ lệ lấp đầy phòng
export const useOccupancyRate = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "occupancy"],
    queryFn: fetcher(DashboardService.getOccupancyRate),
  });
};