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
  Package,
  AlertTriangle,
  Barcode,
  Factory,
  Tag,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Product } from '@/type/product';

const columnHelper = createColumnHelper<Product>();

export const removeVietnameseTones = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

/**
 * A custom filter function that supports searching for words in any order.
 * It splits the search query into individual words and ensures that every word
 * is present in at least one of the searchable columns for the given row.
 */
export const wordsInAnyOrderFilter: FilterFn<Product> = (
  row,
  _columnIds,
  filterValue: string,
) => {
  const normalizedQuery = removeVietnameseTones(filterValue);
  const searchTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  if (searchTerms.length === 0) return true;

  // Concatenate searchable fields from the original product object
  const searchableText = removeVietnameseTones(
    `${row.original.name} ${row.original.barcode ?? ''} ${row.original.category ?? ''} ${row.original.manufacturer ?? ''}`,
  );

  // Ensure every word in the search query is present in the combined searchable text
  return searchTerms.every((term) => searchableText.includes(term));
};

export const ProductListTable = ({ data }: { data: Product[] }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const columns = useMemo(
    () => [
      // 1. Tên Sản Phẩm & Danh Mục
      columnHelper.accessor('name', {
        header: 'Sản phẩm',
        cell: (info) => (
          <div className='flex items-center gap-3 min-w-[200px]'>
            <div className='w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center'>
              <Package className='w-5 h-5 text-slate-400 dark:text-slate-500' />
            </div>
            <div>
              <p className='font-semibold text-sm text-slate-900 dark:text-slate-100 leading-tight'>
                {info.getValue()}
              </p>
              <div className='flex items-center gap-1 mt-0.5'>
                <Tag className='w-3 h-3 text-slate-400' />
                <p className='text-xs text-slate-500 dark:text-slate-400 italic'>
                  {info.row.original.category || 'Chưa phân loại'}
                </p>
              </div>
            </div>
          </div>
        ),
      }),

      // 2. Mã vạch & Nhà sản xuất
      columnHelper.display({
        id: 'details',
        header: 'Thông tin thêm',
        cell: (info) => (
          <div className='text-xs space-y-1 text-slate-600 dark:text-slate-400'>
            <div className='flex items-center gap-1'>
              <Barcode className='w-3 h-3' />{' '}
              {info.row.original.barcode || '---'}
            </div>
            <div className='flex items-center gap-1'>
              <Factory className='w-3 h-3' />{' '}
              {info.row.original.manufacturer || '---'}
            </div>
          </div>
        ),
      }),

      // 3. Tồn kho & Trạng thái
      columnHelper.accessor('stock_quantity', {
        header: 'Tồn kho',
        cell: (info) => {
          const stock = info.getValue();
          const isActive = info.row.original.is_active;
          const isLow = stock <= 5;
          return (
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-1.5'>
                <span
                  className={`font-bold ${isLow ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'}`}
                >
                  {stock}
                </span>
                {isLow && (
                  <AlertTriangle className='w-3.5 h-3.5 text-amber-500' />
                )}
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full w-fit font-medium ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {isActive ? 'Đang bán' : 'Ngừng bán'}
              </span>
            </div>
          );
        },
      }),

      // 4. Bảng Giá (Vốn, Sỉ, Lẻ)
      columnHelper.display({
        id: 'pricing',
        header: 'Bảng giá (VNĐ)',
        cell: (info) => (
          <div className='text-xs space-y-1 py-1'>
            <div className='flex justify-between gap-4'>
              <span className='text-slate-500 dark:text-slate-400'>
                Giá vốn:
              </span>
              <span className='font-medium text-slate-700 dark:text-slate-200'>
                {info.row.original.cost_price?.toLocaleString()}đ
              </span>
            </div>
            <div className='flex justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-1'>
              <span className='text-slate-500 dark:text-slate-400'>
                Giá sỉ:
              </span>
              <span className='font-medium text-blue-600 dark:text-blue-400'>
                {info.row.original.wholesale_price?.toLocaleString()}đ
              </span>
            </div>
            <div className='flex justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-1'>
              <span className='text-slate-500 dark:text-slate-400 font-semibold'>
                Giá lẻ:
              </span>
              <span className='font-bold text-emerald-600 dark:text-emerald-400'>
                {info.row.original.retail_price?.toLocaleString()}đ
              </span>
            </div>
          </div>
        ),
      }),

      // 5. Ngày tạo
      columnHelper.accessor('category', {
        header: 'Nhóm hàng',
        cell: (info) => (
          <span className='text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap'>
            {info.getValue()}
          </span>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter, // 🔍 2. Pass filter state to table
    },
    globalFilterFn: wordsInAnyOrderFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Add this!
    initialState: {
      pagination: {
        pageSize: 30, // Set default rows per page
      },
    },
  });

  return (
    <div className='w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'>
      <div className='relative max-w-md p-3'>
        <div className='absolute inset-y-0 left-1 pl-3 flex items-center pointer-events-none'>
          <Search className='h-4 w-4 text-slate-400' />
        </div>
        <input
          type='text'
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder='Tìm tên hàng, mã vạch, nhóm hàng...'
          className='block w-full pl-10 pr-10 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none shadow-sm'
        />
        {globalFilter && (
          <button
            onClick={() => setGlobalFilter('')}
            className='absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>
      <table className='w-full text-left border-collapse'>
        <thead className='bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className='px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase'
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
              className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='px-4 py-2 align-middle'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex items-center justify-between px-4 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-xl'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-slate-600 dark:text-slate-400'>
            Hiển thị {table.getRowModel().rows.length.toLocaleString()} trên{' '}
            {table.getFilteredRowModel().rows.length.toLocaleString()} hàng
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className='p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'
          >
            <ChevronLeft className='h-4 w-4 text-slate-600 dark:text-slate-400' />
          </button>

          <div className='flex items-center gap-1'>
            <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
              Trang {table.getState().pagination.pageIndex + 1} /{' '}
              {table.getPageCount()}
            </span>
          </div>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className='p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'
          >
            <ChevronRight className='h-4 w-4 text-slate-600 dark:text-slate-400' />
          </button>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className='ml-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg p-1 outline-none focus:ring-2 focus:ring-emerald-500'
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Hiện {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
