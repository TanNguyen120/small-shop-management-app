'use client';

import React, { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  FilterFn,
  getPaginationRowModel,
} from '@tanstack/react-table';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Calendar,
  ExternalLink,
  Printer,
} from 'lucide-react';
import { OrderTransaction } from '@/type/order';
import { removeVietnameseTones } from '../product/ListAllProduct';
import { PrintableReceipt } from './PrintableReceipt';

const columnHelper = createColumnHelper<OrderTransaction>();

export const orderFilterFn: FilterFn<OrderTransaction> = (
  row,
  _columnIds,
  filterValue: string,
) => {
  const normalizedQuery = removeVietnameseTones(filterValue);
  const searchTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  if (searchTerms.length === 0) return true;

  // Search in ID, created_at, total_amount, and item names
  const itemsText = row.original.order_items
    ?.map((item) => item.product_name)
    .join(' ');
  
  const searchableText = removeVietnameseTones(
    `${row.original.id} ${row.original.created_at} ${row.original.total_amount} ${itemsText ?? ''}`,
  );

  return searchTerms.every((term) => searchableText.includes(term));
};

export const OrderListTable = ({ data }: { data: OrderTransaction[] }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderTransaction | null>(null);

  const handlePrint = (order: OrderTransaction) => {
    setSelectedOrder(order);
    // Give it a tiny bit of time to render into the hidden div
    setTimeout(() => {
      window.print();
      setSelectedOrder(null);
    }, 100);
  };

  const columns = useMemo(
    () => [
      // ... (previous columns 1-4 remain the same)
      columnHelper.accessor('id', {
        header: 'Đơn hàng',
        cell: (info) => (
          <div className='flex items-center gap-3 min-w-[150px]'>
            <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
              <Receipt className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <p className='font-mono text-xs text-slate-500 truncate w-24'>
                #{info.getValue().substring(0, 8)}
              </p>
              <div className='flex items-center gap-1 mt-0.5'>
                <Calendar className='w-3 h-3 text-slate-400' />
                <p className='text-xs text-slate-600 dark:text-slate-400'>
                  {new Date(info.row.original.created_at).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        ),
      }),

      columnHelper.display({
        id: 'items',
        header: 'Chi tiết hàng',
        cell: (info) => {
          const items = info.row.original.order_items || [];
          const count = items.reduce((acc, item) => acc + item.quantity, 0);
          return (
            <div className='max-w-[250px]'>
              <p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
                {items.length} mặt hàng ({count} món)
              </p>
              <p className='text-xs text-slate-500 truncate'>
                {items.map(i => i.product_name).join(', ')}
              </p>
            </div>
          );
        },
      }),

      columnHelper.accessor('total_amount', {
        header: 'Thanh toán',
        cell: (info) => (
          <div className='space-y-0.5'>
            <p className='text-sm font-bold text-emerald-600 dark:text-emerald-400'>
              {info.getValue().toLocaleString()}đ
            </p>
            {info.row.original.discount_amount > 0 && (
              <p className='text-[10px] text-orange-500'>
                Giảm: {info.row.original.discount_amount.toLocaleString()}đ
              </p>
            )}
          </div>
        ),
      }),

      columnHelper.accessor('status', {
        header: 'Trạng thái',
        cell: () => (
          <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'>
            Hoàn tất
          </span>
        ),
      }),

      // 5. Actions
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <div className='flex items-center gap-1'>
            <button 
              onClick={() => handlePrint(info.row.original)}
              className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-blue-500'
              title="In hóa đơn"
            >
              <Printer className='w-4 h-4' />
            </button>
            <button className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-600'>
              <ExternalLink className='w-4 h-4' />
            </button>
          </div>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    globalFilterFn: orderFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <>
      <div className='w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm no-print'>
        {/* Search Bar Header */}
        <div className='p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50'>
          <div className='relative max-w-md'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search className='h-4 w-4 text-slate-400' />
            </div>
            <input
              type='text'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder='Tìm mã đơn, ngày, món hàng...'
              className='block w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm placeholder:text-slate-400'
            />
            {globalFilter && (
              <button
                onClick={() => setGlobalFilter('')}
                className='absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors'
              >
                <X className='h-4 w-4' />
              </button>
            )}
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead className='bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className='px-4 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className='hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group'
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='px-4 py-3 align-middle'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className='flex items-center justify-between px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 rounded-b-2xl'>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>
              Hiển thị <span className='text-slate-900 dark:text-slate-100 font-bold'>{table.getRowModel().rows.length}</span> trên{' '}
              <span className='text-slate-900 dark:text-slate-100 font-bold'>{table.getFilteredRowModel().rows.length}</span> đơn hàng
            </span>
          </div>

          <div className='flex items-center gap-1.5'>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className='p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent transition-all shadow-sm'
            >
              <ChevronLeft className='h-4 w-4 text-slate-600 dark:text-slate-400' />
            </button>

            <div className='px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm'>
              <span className='text-xs font-bold text-slate-700 dark:text-slate-200'>
                {table.getState().pagination.pageIndex + 1} <span className='text-slate-400 font-medium mx-1'>/</span> {table.getPageCount()}
              </span>
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className='p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent transition-all shadow-sm'
            >
              <ChevronRight className='h-4 w-4 text-slate-600 dark:text-slate-400' />
            </button>
          </div>
        </div>
      </div>
      {/* Print only container */}
      <div className='hidden print:block'>
        {selectedOrder && <PrintableReceipt order={selectedOrder} />}
      </div>
    </>
  );
};
