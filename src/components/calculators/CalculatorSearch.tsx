'use client';

import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Adsense from "@/components/ads/Adsense";

export default function CalculatorSearch() {
  return (
    <section className="container mx-auto py-12 md:py-16 lg:py-16 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-gray-50">
              Online Calculators for Every Need
            </h1>
            <p className="mx-auto max-w-[600px] text-gray-600 md:text-lg dark:text-gray-400">
              당신의 모든 질문에 대한 답변을 찾아보세요.
            </p>
          </div>
          <div className="w-full max-w-2xl">
            <Adsense />
          </div>
        </div>
      </div>
    </section>
  );
}