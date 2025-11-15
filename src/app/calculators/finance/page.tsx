"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';

const FinancePage = () => {
  const financeCategory = calculatorCategories.find(cat => cat.id === 'finance');

  if (!financeCategory) {
    return <div>금융 카테고리를 찾을 수 없습니다.</div>;
  }

  // Add a description to the category object
  const categoryWithDescription = {
    ...financeCategory,
    description: '저희 금융 계산기를 사용하여 투자 계획을 세우고, 이자율을 계산하고, 구매 시 절약되는 금액을 예상해 보세요. 각 계산기에는 해당 주제에 대한 풍부한 금융 정보와 함께 계산 공식이 포함되어 있습니다.',
  };


  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default FinancePage;