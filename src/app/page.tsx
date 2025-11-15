import AllCalculators from '@/components/AllCalculators';
import CalculatorSearch from '@/components/calculators/CalculatorSearch';
import CalculatorCategories from '@/components/calculators/CalculatorCategories';
import ScientificCalculator from '@/components/calculators/ScientificCalculator';
import { calculatorCategories } from '@/data/calculators';

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center">
  {/* 애드센스/쿠팡 광고 삽입 영역 */}
  <div className="ad-placeholder my-8 p-6 border border-dashed rounded-lg">
    <p className="text-gray-500">광고 영역 (애드센스/쿠팡 코드 여기에 삽입)</p>
  </div>
  <div className="mt-8 mx-auto">
    <CalculatorSearch />
  </div>
</section>

<section className="text-center mt-12">

  <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 sm:text-xl">
    금융, 건강, 생활 등 다양한 분야의 계산기를 지금 바로 만나보세요.
  </p>
</section>

      <AllCalculators />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="lg:col-span-1">
          {/* 첫 번째 칸 - 비워둠 */}
        </div>
        <div className="lg:col-span-1">
          <ScientificCalculator />
        </div>
      </div>
      <CalculatorCategories />
    </div>
  );
}