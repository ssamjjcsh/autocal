'use client';

import { Card, CardContent } from '@/components/ui/card';
import { calculatorCategories } from '@/data/calculators';
import Link from 'next/link';

export default function AllCalculators() {
  return (
    <section className="w-full">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {calculatorCategories.map((category) => (
            <Link href={category.href} key={category.name} className="group">
              <Card className="h-full flex flex-col items-center justify-center p-4 md:p-6 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg shadow-sm">
                <CardContent className="flex flex-col items-center justify-center space-y-2 md:space-y-3">
                  <div className="p-2 md:p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <category.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                  </div>
                  <span className="text-sm md:text-base font-semibold text-center text-gray-800 dark:text-gray-200">
                    {category.name}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}