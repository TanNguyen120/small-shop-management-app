// src/components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Receipt,
  PlusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils'; // shadcn helper
import { createClient } from '@/lib/supabase/client';

const navigation = [
  { name: 'POS', href: '/pages/pos', icon: ShoppingCart },
  { name: 'Đơn hàng', href: '/pages/orders', icon: Receipt },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Sản phẩm', href: '/pages/product-list', icon: Package },
  { name: 'Thêm sản phẩm', href: '/pages/add-product', icon: PlusCircle },
  { name: 'Khách hàng', href: '/customers', icon: Users },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className='flex h-screen w-25 flex-col fixed left-0 top-0 border-r border-slate-800 bg-[#0F172A] text-slate-300 no-print'>
      {/* Logo Area */}
      <div className='flex h-20 items-center justify-center gap-3 border-b border-slate-800 px-6'>
        <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20'>
          <span className='text-white font-bold'>Q</span>
        </div>
        <span className='text-xl font-bold text-white tracking-tight'>
          Xâm Truân Shop
        </span>
      </div>

      {/* Navigation Links */}
      <nav className='flex-1 space-y-1 px-4 py-6 overflow-y-auto'>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'hover:bg-slate-800/50 hover:text-white',
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 transition-colors',
                  isActive
                    ? 'text-emerald-400'
                    : 'text-slate-500 group-hover:text-slate-300',
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User / Bottom Section */}
      <div className='border-t border-slate-800 p-4'>
        <button
          onClick={handleLogout}
          className='flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all'
        >
          <LogOut className='h-5 w-5' />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
