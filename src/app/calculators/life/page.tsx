"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';

const LifePage = () => {
  const lifeCategory = calculatorCategories.find(cat => cat.id === 'life');

  if (!lifeCategory) {
    return <div>생활 카테고리를 찾을 수 없습니다.</div>;
  }

  const categoryWithDescription = {
    ...lifeCategory,
    description: '건강, 시간, 쇼핑 등 일상 생활과 관련된 다양한 계산기를 제공합니다. 저희 계산기를 사용하여 건강한 삶을 계획하고 시간을 효율적으로 관리하며 현명한 소비를 경험해 보세요.',
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default LifePage;