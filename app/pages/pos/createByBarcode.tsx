'use client';

import { useState, useEffect, useRef } from 'react';
import { Barcode, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

import { usePOSStore } from '@/store/use-pos-store';
// import { supabase } from '@/utils/supabase/client'; // Import your client
import { createClient } from '@/lib/supabase/client';

export default function CreateByBarcode() {
  const [barcode, setBarcode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [foundProduct, setFoundProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const addItem = usePOSStore((state) => state.addItem);

  // Keep focus on the input at all times for the POS machine
  const focusInput = () => inputRef.current?.focus();
  useEffect(() => {
    focusInput();
    window.addEventListener('focus', focusInput);
    return () => window.removeEventListener('focus', focusInput);
  }, []);

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode || isProcessing) return;

    setIsProcessing(true);
    setError(null);
    const supabase = createClient();

    try {
      // 1. Search Supabase for the specific barcode
      const { data, error: sbError } = await supabase
        .from('product')
        .select('id, name, retail_price, barcode, stock_quantity')
        .eq('barcode', barcode.trim())
        .single();

      // 2. Handle cases where product doesn't exist
      if (sbError || !data) {
        setError('Sản phẩm chưa có trong hệ thống.');
        // Optional: open the 'Create Product' form here if that's your preferred flow
        // setShowForm(true);
        return;
      }

      // 3. SUCCESS CASE: Found in DB, move to RAM (Zustand)
      addItem(data);
      setFoundProduct(data);
      setBarcode(''); // Clear for next POS machine scan immediately

      // 4. Reset UI feedback after 1.5 seconds
      setTimeout(() => {
        setFoundProduct(null);
        focusInput(); // Ensure the input is ready for the next barcode
      }, 1500);
    } catch (err) {
      console.error('POS Scan Error:', err);
      setError('Lỗi kết nối hệ thống.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='w-full space-y-6'>
      <div className='bg-[#1E293B] border border-slate-800 rounded-[32px] p-8 flex flex-col items-center justify-center text-center transition-all'>
        {/* Dynamic Icon Based on State */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border transition-all ${
            foundProduct
              ? 'bg-emerald-500/20 border-emerald-500/40 animate-bounce'
              : error
                ? 'bg-red-500/20 border-red-500/40'
                : 'bg-slate-800 border-slate-700'
          }`}
        >
          {isProcessing ? (
            <Loader2 className='text-emerald-500 animate-spin' size={32} />
          ) : foundProduct ? (
            <CheckCircle2 className='text-emerald-500' size={32} />
          ) : error ? (
            <AlertCircle className='text-red-400' size={32} />
          ) : (
            <Barcode className='text-slate-400' size={32} />
          )}
        </div>

        {/* Status Text */}
        <div className='h-16 mb-4'>
          {foundProduct ? (
            <div className='animate-in fade-in slide-in-from-bottom-2'>
              <h2 className='text-lg font-bold text-white'>
                {foundProduct.name}
              </h2>
              <p className='text-emerald-500 font-medium'>+1 vào giỏ hàng</p>
            </div>
          ) : error ? (
            <div className='text-red-400'>
              <p className='font-semibold'>{error}</p>
              <button
                onClick={() => setError(null)}
                className='text-xs underline text-slate-500'
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div>
              <h2 className='text-lg font-semibold text-white'>
                Quét mã sản phẩm
              </h2>
              <p className='text-slate-400 text-sm'>Máy quét đã sẵn sàng...</p>
            </div>
          )}
        </div>

        <form
          onSubmit={handleBarcodeSubmit}
          className='w-full max-w-md relative'
        >
          <input
            ref={inputRef}
            type='text'
            autoComplete='off'
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder='Quét mã vạch...'
            className={`w-full bg-slate-950 border rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all ${
              error
                ? 'border-red-500/50'
                : 'border-slate-800 focus:border-emerald-500'
            }`}
          />
          <Barcode
            className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
            size={20}
          />
        </form>
      </div>
    </div>
  );
}
