import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Briefcase, Landmark, PiggyBank, Building, HandCoins, FileText, Calculator as CalculatorIcon } from 'lucide-react';

interface Calculator {
  id: string;
  name: string;
  href: string;
}

interface Subcategory {
  id: string;
  name: string;
  calculators: Calculator[];
}

interface CategoryPageLayoutProps {
  category: {
    name: string;
    description: string;
    subcategories: Subcategory[];
  };
}

const ICONS: { [key: string]: React.ElementType } = {
  'business-calculators': Briefcase,
  'interest-and-loans': Landmark,
  'investment-calculators': PiggyBank,
  'real-estate': Building,
  'tax-calculators': HandCoins,
  default: FileText,
};

const CategoryPageLayout: React.FC<CategoryPageLayoutProps> = ({ category }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubcategories = category.subcategories
    .map(subcategory => ({
      ...subcategory,
      calculators: subcategory.calculators.filter(calculator =>
        calculator.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(subcategory => subcategory.calculators.length > 0);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {category.name} 계산기
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            {category.description}
          </p>
        </div>

        <div className="mb-10 max-w-lg mx-auto">
          <Input
            type="text"
            placeholder="계산기 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 text-lg border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="space-y-12">
          {filteredSubcategories.map(subcategory => {
            const Icon = ICONS[subcategory.id] || ICONS.default;
            return (
              <Card key={subcategory.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <CardHeader className="bg-gray-50 dark:bg-gray-700/50 p-3">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                      {React.createElement(Icon, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" })}
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{subcategory.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {subcategory.calculators.map(calculator => (
                      <li key={calculator.id}>
                        <Link href={calculator.href} passHref>
                          <div className="group flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                            <div className="flex items-center space-x-3">
                              <CalculatorIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                              <span className="text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                                {calculator.name}
                              </span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 transform transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryPageLayout;