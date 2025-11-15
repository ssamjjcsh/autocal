"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';

const GamePage = () => {
  const gameCategory = calculatorCategories.find(cat => cat.id === 'game');

  if (!gameCategory) {
    return <div>게임 카테고리를 찾을 수 없습니다.</div>;
  }

  const categoryWithDescription = {
    ...gameCategory,
    description: 'RPG 등 다양한 장르의 게임 플레이에 도움이 되는 계산기를 제공합니다. 캐릭터의 DPS를 계산하고 게임 내 전략을 세우는 데 활용해 보세요.',
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default GamePage;