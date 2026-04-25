'use client';

import { usePOSStore } from '@/store/use-pos-store';
import { useEffect, useState, useTransition } from 'react';
import { Trash2, Tag, Banknote, Loader2 } from 'lucide-react';
import { saveOrderAction } from '@/app/actions/orders';
import { PrintableReceipt } from '@/components/order/PrintableReceipt';
import { OrderTransaction } from '@/type/order';

export function OrderList() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderTransaction | null>(null);

  // You need both [isPending, startTransition]
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const {
    items,
    removeItem,
    updateQuantity,
    updatePrice,
    discount,
    setDiscount,
    getTotal,
    getFinalTotal,
    clearCart,
  } = usePOSStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  if (!isHydrated) return <div className='p-8 text-slate-500'>Syncing...</div>;

  const handleSaveOrder = () => {
    if (items.length === 0) return;

    startTransition(async () => {
      setStatusMessage(null);

      const result = await saveOrderAction(items, getFinalTotal(), discount);

      if (result.success && result.orderId) {
        setStatusMessage({ type: 'success', text: 'Đã lưu đơn hàng!' });
        
        // Prepare data for printing
        const orderForPrinting: OrderTransaction = {
          id: result.orderId,
          user_id: '', // Not strictly needed for receipt
          total_amount: getFinalTotal(),
          discount_amount: discount,
          created_at: new Date().toISOString(),
          order_items: items.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            unit_price_paid: item.retail_price,
            product_name: item.name
          }))
        };

        setLastOrder(orderForPrinting);
        
        // Auto trigger print
        setTimeout(() => {
          window.print();
          setLastOrder(null);
          clearCart(); // Wipes the RAM store
        }, 500);

        // Clear success message after 3 seconds
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage({ type: 'error', text: `Lỗi: ${result.error}` });
      }
    });
  };

  return (
    <div className='flex flex-col h-full bg-[#1E293B]'>
      <div className='no-print flex flex-col h-full'>
        {/* Scrollable Items Area */}
        <div className='flex-1 overflow-y-auto p-4 space-y-3'>
          {items.map((item) => (
            <div
              key={item.id}
              className='bg-slate-900/80 border border-slate-800 p-4 rounded-2xl'
            >
              <div className='flex justify-between items-start mb-3'>
                <h4 className='text-white font-medium'>{item.name}</h4>
                <button
                  onClick={() => removeItem(item.id)}
                  className='text-slate-500 hover:text-red-400'
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className='flex items-end justify-between'>
                {/* ITEM PRICE EDIT */}
                <div className='space-y-1'>
                  <p className='text-[10px] text-slate-500 uppercase font-bold tracking-wider'>
                    Đơn giá
                  </p>
                  <div className='flex items-center border-b border-slate-700 focus-within:border-emerald-500 transition-colors'>
                    <input
                      type='number'
                      className='bg-transparent text-emerald-400 font-bold outline-none w-20 text-sm'
                      value={item.retail_price}
                      onChange={(e) =>
                        updatePrice(item.id, parseFloat(e.target.value) || 0)
                      }
                    />
                    <span className='text-emerald-400 text-xs'>đ</span>
                  </div>
                </div>

                {/* QUANTITY CONTROLS */}
                <div className='flex items-center bg-slate-800 rounded-lg p-1'>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className='px-2 text-slate-400'
                  >
                    -
                  </button>
                  <input
                    type='number'
                    className='w-8 bg-transparent text-center text-white text-xs outline-none'
                    value={item.quantity}
                    readOnly
                  />
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className='px-2 text-slate-400'
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER: GLOBAL DISCOUNT & TOTAL */}
        <div className='p-6 bg-slate-900/90 border-t border-slate-800 shadow-2xl'>
          <div className='space-y-3 mb-6'>
            {/* GLOBAL DISCOUNT INPUT */}
            <div className='flex items-center justify-between group'>
              <div className='flex items-center gap-2 text-slate-400 group-focus-within:text-orange-400 transition-colors'>
                <Tag size={16} />
                <span className='text-sm font-medium'>Giảm giá</span>
              </div>
              <div className='flex items-center border-b border-slate-700 group-focus-within:border-orange-500 transition-all'>
                <input
                  type='number'
                  className='bg-transparent text-right text-orange-400 font-bold outline-none w-24 text-sm'
                  placeholder='0'
                  value={discount || ''}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />
                <span className='text-orange-400 text-xs ml-1'>đ</span>
              </div>
            </div>

            <div className='h-[1px] bg-slate-800 w-full' />

            {/* SUMMARY */}
            <div className='flex justify-between text-xs text-slate-500'>
              <span>Tạm tính ({items.length} món):</span>
              <span>{getTotal().toLocaleString()}đ</span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-slate-200 font-bold'>Thành tiền:</span>
              <span className='text-3xl font-black text-white tracking-tight'>
                {getFinalTotal().toLocaleString()}đ
              </span>
            </div>
          </div>

          <button
            onClick={handleSaveOrder}
            disabled={isPending || items.length === 0}
            className='w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg'
          >
            {isPending ? (
              <>
                <Loader2 className='animate-spin' size={20} />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Banknote size={20} />
                <span>THANH TOÁN (F9)</span>
              </>
            )}
          </button>
        </div>
        {statusMessage && (
          <div
            className={`mb-4 p-3 rounded-xl text-center text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-500 border border-red-500/30'
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>

      {/* Print only container */}
      <div className='hidden print:block'>
        {lastOrder && <PrintableReceipt order={lastOrder} />}
      </div>
    </div>
  );
}
