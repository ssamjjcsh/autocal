'use client';

import { useParams } from 'next/navigation';
import { calculators, calculatorCategories } from '@/data/calculators';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CategoryPage() {
  const params = useParams();

  if (!params) {
    return <div>로딩 중...</div>; // 또는 다른 로딩 상태 표시
  }

  const categorySlug = params.category as string;

  const category = calculatorCategories.find(cat => cat.href === `/calculators/${categorySlug}`);
  const categoryCalculators = calculators[categorySlug as keyof typeof calculators] || [];

  if (!category) {
    return <div>카테고리를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">{category.name} 계산기</h1>
      <p className="text-lg text-gray-600 mb-8">총 {categoryCalculators.length}개의 계산기가 있습니다.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoryCalculators.map((calculator) => (
          <Link href={`/calculators/${categorySlug}/${calculator.id}`} key={calculator.id} className="group">

            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{calculator.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">{calculator.description}</p>
              </CardContent>
            </Card>

          </Link>
        ))}
      </div>
    </div>
  );
}