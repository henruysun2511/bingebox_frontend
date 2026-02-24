"use client";
import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTicketPrice, useTicketPriceList } from "@/queries/useTicketPrice";
import { TicketPriceParams } from "@/types/param";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ticketPriceColumns } from "./ticketPrice-column";
import { TicketPriceDialog } from "./ticketPrice-dialog";
import { TicketPriceFilter } from "./ticketPrice-filter";

export default function TicketPricePage() {
    const [page, setPage] = useState(1);
    const [params, setParams] = useState<TicketPriceParams>({});
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>();
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const { data, isPending } = useTicketPriceList({...params, page, limit: 20});
    console.log(data);
    const deleteMu = useDeleteTicketPrice();

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">Giá Vé</h1>
                <Button className="btn-custom" onClick={() => { setSelected(undefined); setOpen(true); }}>
                    <Plus size={16} className="mr-2" /> Thêm cấu hình giá vé
                </Button>
            </div>

            <TicketPriceFilter params={params} setParams={setParams} setPage={setPage} />

            <DataTable
                loading={isPending}
                data={data?.data || []}
                columns={ticketPriceColumns(
                    (item) => { setSelected(item); setOpen(true); },
                    (id) => setIdToDelete(id)
                )}
            />

            <DataPagination
                page={page}
                totalPages={data?.pagination?.totalPages || 1}
                onPageChange={setPage}
            />

            <TicketPriceDialog open={open} onClose={() => setOpen(false)} data={selected} />

            <ConfirmDialog
                open={!!idToDelete}
                onClose={() => setIdToDelete(null)}
                onConfirm={() => deleteMu.mutate(idToDelete!, { onSuccess: () => setIdToDelete(null) })}
                isLoading={deleteMu.isPending}
            />
        </div>
    );
}