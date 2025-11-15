'use client';

import Link from 'next/link';
import { calculatorCategories } from '@/data/calculators';
import { MoreHorizontal } from 'lucide-react';

const categoryStyles: { [key: string]: { color: string; border: string; text: string; } } = {
    financial: { color: 'text-purple-600', border: 'border-purple-200 hover:border-purple-400', text: 'text-purple-600' },
    conversion: { color: 'text-green-600', border: 'border-green-200 hover:border-green-400', text: 'text-green-600' },
    'daily-life': { color: 'text-cyan-600', border: 'border-cyan-200 hover:border-cyan-400', text: 'text-cyan-600' },
    science: { color: 'text-red-600', border: 'border-red-200 hover:border-red-400', text: 'text-red-600' },
    engineering: { color: 'text-orange-600', border: 'border-orange-200 hover:border-orange-400', text: 'text-orange-600' },
    materials: { color: 'text-gray-600', border: 'border-gray-200 hover:border-gray-400', text: 'text-gray-600' },
    gaming: { color: 'text-indigo-600', border: 'border-indigo-200 hover:border-indigo-400', text: 'text-indigo-600' },
    etc: { color: 'text-pink-600', border: 'border-pink-200 hover:border-pink-400', text: 'text-pink-600' },
};

const defaultStyle = { color: 'text-gray-600', border: 'border-gray-200 hover:border-gray-400', text: 'text-gray-600' };

export default function CalculatorCategories() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {calculatorCategories.map((category) => {
          const style = categoryStyles[category.id] || defaultStyle;
          const allCalculators = category.subcategories.flatMap(
            (subcategory) => subcategory.calculators
          );
          const calculatorsToShow = allCalculators.slice(0, 5);
          const placeholdersNeeded = 5 - calculatorsToShow.length;
          const placeholderCalculators = Array.from({ length: placeholdersNeeded }, (_, i) => ({
            id: `placeholder-${category.id}-${i}`,
            name: '준비중',
            href: '#', // 클릭해도 아무 동작 안하도록
            isPlaceholder: true,
          }));

          const itemsToDisplay = [...calculatorsToShow, ...placeholderCalculators];

          return (
            <div key={category.id}>
              <Link href={category.href} className="group mb-3 inline-block">
                <h3 className={`text-base font-bold ${style.color} group-hover:underline`}>
                  {category.name} ›
                </h3>
              </Link>
              <div className="flex flex-col gap-1">
                {itemsToDisplay.map((calculator) => (
                  <Link
                    href={calculator.href}
                    key={calculator.id}
                    className={`flex items-center gap-2 p-2 border rounded-md transition-colors bg-white dark:bg-gray-950 ${style.border} hover:bg-gray-50 dark:hover:bg-gray-900`}
                  >
                    <category.icon className={`w-4 h-4 ${style.color}`} />
                    <span className="text-sm text-sm font-normal text-gray-800 dark:text-gray-200">{calculator.name}</span>
                  </Link>
                ))}
                <Link
                  href={category.href}
                  className={`flex items-center gap-2 p-2 border rounded-md transition-colors bg-white dark:bg-gray-950 ${style.border} hover:bg-gray-50 dark:hover:bg-gray-900`}
                >
                  <MoreHorizontal className={`w-4 h-4 ${style.color}`} />
                  <span className="font-normal text-gray-800 dark:text-gray-200">더 많은 토픽</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}