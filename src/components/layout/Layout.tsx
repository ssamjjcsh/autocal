'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import LeftAdRail from '@/components/ads/LeftAdRail';
import RightAdRail from '@/components/ads/RightAdRail';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="flex">
        <LeftAdRail />
        <main className="flex-1 px-3 py-3 sm:px-5 lg:px-7 overflow-y-auto overflow-x-hidden max-w-5xl mx-auto">
          {children}
        </main>
        <RightAdRail />
      </div>
    </div>
  );
};

export default Layout;