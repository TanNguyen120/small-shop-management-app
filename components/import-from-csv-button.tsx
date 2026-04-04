'use client';

import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx'; // 👈 Added for Excel support
import Papa from 'papaparse';
import { Loader2, FileSpreadsheet } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/supabase';
import { processProductCsv } from '@/lib/helper/csvRelateHelpers';

export const DataImportButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: uploadProducts, isPending } = useMutation({
    mutationFn: async (products: any[]) => {
      const { error } = await supabase
        .from('product')
        .upsert(products, { onConflict: 'product_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      alert('Nhập dữ liệu thành công!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => alert(`Lỗi: ${error.message}`),
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const fileName = file.name.toLowerCase();

    try {
      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        // --- 📊 EXCEL PROCESSING ---
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        console.log('Excel Workbook:', workbook); // Debug log to check the workbook structure
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        console.log('Excel Worksheet:', worksheet); // Debug log to check the worksheet structure
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log('Parsed Excel Data:', jsonData); // Debug log to check the parsed data structure
        const formatted = processProductCsv(jsonData as any[]);
        console.log('Formatted Product Data:', formatted); // Debug log to check the formatted data structure

        uploadProducts(formatted);
      } else if (fileName.endsWith('.csv')) {
        // --- 📄 CSV PROCESSING ---
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const formatted = processProductCsv(results.data as any[]);
            uploadProducts(formatted);
          },
        });
      } else {
        alert('Vui lòng chọn file .csv hoặc .xlsx');
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Có lỗi xảy ra khi đọc file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <input
        type='file'
        accept='.csv, .xlsx, .xls'
        className='hidden'
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing || isPending}
        className='flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-all shadow-md shadow-emerald-100'
      >
        {isProcessing || isPending ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (
          <FileSpreadsheet className='w-4 h-4' />
        )}
        <span>Nhập File (CSV/Excel)</span>
      </button>
    </div>
  );
};
