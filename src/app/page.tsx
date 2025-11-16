import AllCalculators from '@/components/AllCalculators';
import CalculatorSearch from '@/components/calculators/CalculatorSearch';
import CalculatorCategories from '@/components/calculators/CalculatorCategories';
import ScientificCalculator from '@/components/calculators/ScientificCalculator';
import FooterSection from '@/components/sections/FooterSection';
import { Card, CardContent } from "@/components/ui/card";
import CombinedUnitConverter from '@/components/calculators/CombinedUnitConverter';


export default function Home() {
  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-600 sm:text-xl">
            금융, 건강, 생활, 엔지니어링 등 다양한 분야의 계산기를 지금 바로 만나보세요.
          </p>
        </section>

        <AllCalculators />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-stretch">
          <div className="lg:col-span-1 h-full">
            <CombinedUnitConverter />
          </div>
          <div className="lg:col-span-1">
            <ScientificCalculator />
          </div>
        </div>
        <CalculatorCategories />

      </div>
      <FooterSection />
    </>
  );
}