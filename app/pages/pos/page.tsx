'use client';

import { useState, useEffect, useRef } from 'react';
import { Package, Barcode, Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateByBarcode() {
  const [barcode, setBarcode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on load so the scanner is ready immediately
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode) return;

    setIsProcessing(true);

    // Simulate a check to see if barcode exists in DB
    // In real app: const res = await fetch(`/api/products/${barcode}`)
    setTimeout(() => {
      setIsProcessing(false);
      setShowForm(true);
    }, 800);
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link
            href='/products'
            className='p-2 hover:bg-slate-800 rounded-xl transition-colors'
          >
            <ArrowLeft className='text-slate-400' size={20} />
          </Link>
          <h1 className='text-2xl font-bold text-white'>
            Nhập hàng bằng mã vạch
          </h1>
        </div>
      </div>

      {!showForm ? (
        /* Step 1: Scanner Listener Area */
        <div className='bg-[#1E293B] border border-slate-800 rounded-[32px] p-12 flex flex-col items-center justify-center text-center'>
          <div className='w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/20'>
            <Barcode className='text-emerald-500' size={40} />
          </div>
          <h2 className='text-xl font-semibold text-white mb-2'>
            Sẵn sàng quét mã
          </h2>
          <p className='text-slate-400 max-w-xs mb-8'>
            Vui lòng sử dụng máy quét hoặc nhập mã vạch thủ công để bắt đầu.
          </p>

          <form
            onSubmit={handleBarcodeSubmit}
            className='w-full max-w-sm relative'
          >
            <input
              ref={inputRef}
              type='text'
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder='Quét mã vạch tại đây...'
              className='w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all'
            />
            <Barcode
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
              size={20}
            />

            {isProcessing && (
              <div className='mt-4 flex items-center justify-center gap-2 text-emerald-500 text-sm'>
                <Loader2 className='animate-spin' size={16} />
                Đang kiểm tra mã...
              </div>
            )}
          </form>
        </div>
      ) : (
        /* Step 2: Create Product Form */
        <div className='bg-[#1E293B] border border-slate-800 rounded-[32px] overflow-hidden'>
          <div className='p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/30'>
            <div className='flex items-center gap-3'>
              <span className='bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase'>
                Mã: {barcode}
              </span>
              <button
                onClick={() => {
                  setShowForm(false);
                  setBarcode('');
                }}
                className='text-xs text-slate-400 hover:text-white underline'
              >
                Quét mã khác
              </button>
            </div>
          </div>

          <form className='p-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-slate-400 ml-1'>
                Tên sản phẩm
              </label>
              <input
                className='w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-emerald-500 outline-none'
                placeholder='VD: Nước giải khát Coca-Cola'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-slate-400 ml-1'>
                Nhóm hàng
              </label>
              <select className='w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-emerald-500 outline-none'>
                <option>Giải khát</option>
                <option>Bánh kẹo</option>
                <option>Gia dụng</option>
              </select>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-slate-400 ml-1'>
                Giá vốn
              </label>
              <input
                type='number'
                className='w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-emerald-500 outline-none'
                placeholder='0'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-slate-400 ml-1'>
                Giá bán lẻ
              </label>
              <input
                type='number'
                className='w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-emerald-500 outline-none'
                placeholder='0'
              />
            </div>

            <div className='md:col-span-2 pt-4'>
              <button className='w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2'>
                <Save size={20} />
                Lưu sản phẩm
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
