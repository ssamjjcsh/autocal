"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';

const OthersPage = () => {
  const othersCategory = calculatorCategories.find(cat => cat.id === 'others');

  if (!othersCategory) {
    return <div>기타 카테고리를 찾을 수 없습니다.</div>;
  }

  const categoryWithDescription = {
    ...othersCategory,
    description: '어디에도 속하지 않는 재미있고 유용한 계산기들을 모아두었습니다. 무작위 숫자 생성기 등 일상에 소소한 재미를 더해 줄 계산기들을 만나 보세요.',
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default OthersPage;