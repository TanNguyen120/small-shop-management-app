import Link from 'next/link';
import React, { Suspense } from 'react';
import { AddProductButton } from '../add-product-button';
import { AuthButton } from '../auth-button';

const HeaderNav = () => {
  return (
    <div className='flex-1 w-full flex flex-col gap-20 items-center'>
      <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
        <div className='w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm'>
          <div className='flex gap-5 items-center font-semibold'>
            <Link href={'/'}>Shop Xam Truan</Link>
            <div className='flex items-center gap-2'>
              <AddProductButton />
            </div>
          </div>

          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </nav>
    </div>
  );
};

export default HeaderNav;
