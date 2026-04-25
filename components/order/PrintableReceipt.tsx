'use client';

import React from 'react';
import { OrderTransaction } from '@/type/order';

interface PrintableReceiptProps {
  order: OrderTransaction;
}

export const PrintableReceipt = React.forwardRef<HTMLDivElement, PrintableReceiptProps>(
  ({ order }, ref) => {
    return (
      <div ref={ref} className="p-4 bg-white text-black font-mono text-sm w-[80mm] mx-auto shadow-none">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold uppercase">Xâm Truân Shop 😂 😂</h2>
          <p className="text-xs">Ấp thị 1 Chợ Mới An Giang</p>
          <p className="text-xs">Tel: 0123 456 789</p>
        </div>

        <div className="border-b border-dashed border-black mb-2"></div>

        <div className="mb-2">
          <p>Mã ĐH: #{order.id.substring(0, 8)}</p>
          <p>Ngày: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
        </div>

        <div className="border-b border-dashed border-black mb-2"></div>

        <table className="w-full mb-2">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-1">Tên</th>
              <th className="text-center py-1">SL</th>
              <th className="text-right py-1">Giá</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="py-1 leading-tight">{item.product_name}</td>
                <td className="text-center py-1">{item.quantity}</td>
                <td className="text-right py-1">
                  {(item.unit_price_paid * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-dashed border-black pt-2 space-y-1">
          <div className="flex justify-between font-bold">
            <span>Tổng tiền:</span>
            <span>{(order.total_amount + (order.discount_amount || 0)).toLocaleString()}đ</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-xs">
              <span>Giảm giá:</span>
              <span>-{order.discount_amount.toLocaleString()}đ</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-black border-t border-black pt-1">
            <span>THANH TOÁN:</span>
            <span>{order.total_amount.toLocaleString()}đ</span>
          </div>
        </div>

        <div className="text-center mt-6 pt-4 border-t border-dashed border-black">
          <p className="font-bold">CẢM ƠN QUÝ KHÁCH!</p>
          <p className="text-[10px]">Hẹn gặp lại quý khách</p>
        </div>
      </div>
    );
  }
);

PrintableReceipt.displayName = 'PrintableReceipt';
