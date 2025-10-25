import React from "react";
import { useParams } from "react-router-dom";
import {
 createColumnHelper,
 flexRender,
 getCoreRowModel,
 getFilteredRowModel,
 getPaginationRowModel,
 getSortedRowModel,
 SortingState,
 useReactTable,
 ColumnOrderState,
} from "@tanstack/react-table";
import Input from "@/components/Input";
import { listCandidates } from "@/db/candidates";
import { getJob } from "@/db/jobs";
import { formatDate } from "@/utils/format";

type Row = {
 name: string;
 email: string;
 phone: string;
 gender: string;
 linkedin: string;
 domicile: string;
 appliedAt: string;
};

export default function CandidatesPage() {
 const { jobId } = useParams();
 const job = getJob(jobId!);
 const data: Row[] = React.useMemo(() => {
  const list = listCandidates(jobId!);
  return list.map((c) => {
   const attr = (k: string) =>
    c.attributes.find((a) => a.key === k)?.value || "";
   return {
    name: attr("full_name"),
    email: attr("email"),
    phone: attr("phone") || attr("phone_number"),
    gender: attr("gender"),
    linkedin: attr("linkedin_link"),
    domicile: attr("domicile"),
    appliedAt: c.applied_at,
   };
  });
 }, [jobId]);

 const columnHelper = createColumnHelper<Row>();
 const columns = [
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("phone", { header: "Phone" }),
  columnHelper.accessor("gender", { header: "Gender" }),
  columnHelper.accessor("linkedin", {
   header: "LinkedIn",
   cell: (info) =>
    info.getValue() ? (
     <a
      href={info.getValue()}
      target='_blank'
      className='text-indigo-400 hover:underline'
     >
      {info.getValue()}
     </a>
    ) : (
     ""
    ),
  }),
  columnHelper.accessor("domicile", { header: "Domicile" }),
  columnHelper.accessor("appliedAt", {
   header: "Applied Date",
   cell: (info) => formatDate(info.getValue()),
  }),
 ];

 const [sorting, setSorting] = React.useState<SortingState>([]);
 const [globalFilter, setGlobalFilter] = React.useState("");
 const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(() => {
  const raw = localStorage.getItem(`table:order:${jobId}`);
  return raw ? JSON.parse(raw) : columns.map((c) => c.id!.toString());
 });
 const [columnSizing, setColumnSizing] = React.useState<Record<string, number>>(
  () => {
   const raw = localStorage.getItem(`table:size:${jobId}`);
   return raw ? JSON.parse(raw) : {};
  }
 );

 const table = useReactTable({
  data,
  columns,
  state: { sorting, globalFilter, columnOrder, columnSizing },
  onSortingChange: setSorting,
  onGlobalFilterChange: setGlobalFilter,
  onColumnOrderChange: (updater) => {
   const next = typeof updater === "function" ? updater(columnOrder) : updater;
   setColumnOrder(next);
   localStorage.setItem(`table:order:${jobId}`, JSON.stringify(next));
  },
  onColumnSizingChange: (updater) => {
   const next = typeof updater === "function" ? updater(columnSizing) : updater;
   setColumnSizing(next);
   localStorage.setItem(`table:size:${jobId}`, JSON.stringify(next));
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  columnResizeMode: "onChange",
  enableColumnResizing: true,
 });

 const [draggingId, setDraggingId] = React.useState<string | null>(null);
 const onDragStart = (id: string) => (e: React.DragEvent) => {
  setDraggingId(id);
  e.dataTransfer.setData("text/plain", id);
  e.dataTransfer.effectAllowed = "move";
 };
 const onDragOver = (id: string) => (e: React.DragEvent) => {
  e.preventDefault();
 };
 const onDrop = (id: string) => (e: React.DragEvent) => {
  e.preventDefault();
  const fromId = draggingId;
  const toId = id;
  setDraggingId(null);
  if (!fromId || fromId === toId) return;
  const order = table.getState().columnOrder.filter(Boolean);
  const fromIndex = order.indexOf(fromId);
  const toIndex = order.indexOf(toId);
  const newOrder = order.slice();
  newOrder.splice(fromIndex, 1);
  newOrder.splice(toIndex, 0, fromId);
  table.setColumnOrder(newOrder);
 };

 return (
  <div className='flex flex-col gap-3'>
   <div className='flex items-center justify-between'>
    <h2 className='m-0 text-xl font-semibold'>{job?.title} — Candidates</h2>
    <div className='w-[300px]'>
     <Input
      placeholder='Search candidates...'
      value={globalFilter ?? ""}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
     />
    </div>
   </div>

   <div className='card overflow-hidden'>
    <table className='min-w-full'>
     <thead className='bg-slate-800/60'>
      {table.getHeaderGroups().map((hg) => (
       <tr key={hg.id} className='divide-x divide-slate-800'>
        {hg.headers.map((header) => {
         const canSort = header.column.getCanSort();
         const isSorted = header.column.getIsSorted();
         return (
          <th
           key={header.id}
           draggable
           onDragStart={onDragStart(header.column.id)}
           onDragOver={onDragOver(header.column.id)}
           onDrop={onDrop(header.column.id)}
           className={`${
            draggingId === header.column.id ? "opacity-50 " : ""
           }relative text-left text-sm font-semibold px-3 py-2 select-none`}
           style={{ width: header.getSize() }}
          >
           <div
            className={`${
             canSort ? "cursor-pointer " : ""
            }flex items-center gap-1`}
            onClick={
             canSort ? header.column.getToggleSortingHandler() : undefined
            }
           >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {isSorted ? (isSorted === "asc" ? "▲" : "▼") : ""}
           </div>
           <div
            className='absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-indigo-500/30'
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
           />
          </th>
         );
        })}
       </tr>
      ))}
     </thead>
     <tbody className='divide-y divide-slate-800'>
      {table.getRowModel().rows.map((row) => (
       <tr key={row.id} className='divide-x divide-slate-800'>
        {row.getVisibleCells().map((cell) => (
         <td key={cell.id} className='px-3 py-2 text-sm'>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
         </td>
        ))}
       </tr>
      ))}
     </tbody>
    </table>
   </div>

   <div className='flex items-center justify-between mt-2'>
    <div className='text-slate-400 text-sm'>
     Drag headers to reorder • Drag divider to resize • Click header to sort
    </div>
    <div className='flex items-center gap-2'>
     <button
      className='btn btn-base'
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
     >
      ← Prev
     </button>
     <div className='px-2 py-1 rounded-full border border-slate-700 bg-slate-800 text-sm'>
      Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
     </div>
     <button
      className='btn btn-base'
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
     >
      Next →
     </button>
    </div>
   </div>
  </div>
 );
}
