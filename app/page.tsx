import { ThemeSwitcher } from '@/components/theme-switcher';

import Link from 'next/link';
import InventoryPage from './pages/product-list/page';

export default function Home() {
  return (
    <main className='min-h-screen flex flex-col items-center bg-slate-950'>
      <div className='flex-1 flex flex-col gap-20 max-w-5xl p-5'>
        <main className='flex-1 flex flex-col gap-6 px-4'>
          <Link href='/pages/product-list'>List of Products</Link>
          <InventoryPage />
        </main>
      </div>

      <footer className='w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16'>
        <p>
          Powered by{' '}
          <a
            href='https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs'
            target='_blank'
            className='font-bold hover:underline'
            rel='noreferrer'
          >
            Supabase
          </a>
        </p>
        <ThemeSwitcher />
      </footer>
    </main>
  );
}
