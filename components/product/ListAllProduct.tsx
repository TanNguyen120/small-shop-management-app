import React, { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';
import { Package, AlertTriangle, Barcode, Factory, Tag } from 'lucide-react';
import { Product } from '@/type/product';

const columnHelper = createColumnHelper<Product>();

export const ProductListTable = ({ data }: { data: Product[] }) => {
  const columns = useMemo(
    () => [
      // 1. Tên Sản Phẩm & Danh Mục
      columnHelper.accessor('name', {
        header: 'Sản phẩm',
        cell: (info) => (
          <div className='flex items-center gap-3 min-w-[200px]'>
            <div className='w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center'>
              <Package className='w-5 h-5 text-slate-400' />
            </div>
            <div>
              <p className='font-semibold text-sm text-slate-900 leading-tight'>
                {info.getValue()}
              </p>
              <div className='flex items-center gap-1 mt-0.5'>
                <Tag className='w-3 h-3 text-slate-400' />
                <p className='text-xs text-slate-500 italic'>
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
          <div className='text-xs space-y-1 text-slate-600'>
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
                  className={`font-bold ${isLow ? 'text-red-500' : 'text-slate-700'}`}
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
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
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
              <span className='text-slate-400'>Giá vốn:</span>
              <span className='font-medium'>
                {info.row.original.cost_price?.toLocaleString()}đ
              </span>
            </div>
            <div className='flex justify-between gap-4 border-t border-slate-50 pt-1'>
              <span className='text-slate-400'>Giá sỉ:</span>
              <span className='font-medium text-blue-600'>
                {info.row.original.wholesale_price?.toLocaleString()}đ
              </span>
            </div>
            <div className='flex justify-between gap-4 border-t border-slate-50 pt-1'>
              <span className='text-slate-400 font-semibold'>Giá lẻ:</span>
              <span className='font-bold text-emerald-600'>
                {info.row.original.retail_price?.toLocaleString()}đ
              </span>
            </div>
          </div>
        ),
      }),

      // 5. Ngày tạo
      columnHelper.accessor('created_at', {
        header: 'Ngày tạo',
        cell: (info) => (
          <span className='text-xs text-slate-400 whitespace-nowrap'>
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
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className='w-full overflow-x-auto rounded-xl border border-slate-200 bg-card shadow-sm'>
      <table className='w-full text-left border-collapse'>
        <thead className='bg-slate-50 border-b border-slate-200'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className='px-4 py-3 text-xs font-bold text-slate-600 uppercase'
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
        <tbody className='divide-y divide-slate-100'>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className='hover:bg-slate-50/50 transition-colors'>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='px-4 py-2 align-middle'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
