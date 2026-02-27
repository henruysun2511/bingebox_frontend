import { GeneralStat } from "./general-stat";
import { MembershipDistribution } from "./membership-distribution";
import { Revenue } from "./revenue";
import { ShowtimeSales } from "./showtime-sales";
import { TicketSales } from "./ticket-sales";
import { TopCustomer } from "./top-customer";
import { TopMovie } from "./top-movie";


export default function Page() {
  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
 <h1 className="text-2xl font-bold text-white">Tổng quan Admin</h1>
        {/* ===== Overview ===== */}
        <section>
          <GeneralStat />
        </section>

        {/* ===== Revenue + Ticket ===== */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Revenue />
          <TicketSales />
        </section>

        {/* ===== Showtime + Membership ===== */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ShowtimeSales />
          <MembershipDistribution />
        </section>

        {/* ===== Leaderboards ===== */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TopMovie />
          <TopCustomer />
        </section>

      </div>
    </div>
  );
}