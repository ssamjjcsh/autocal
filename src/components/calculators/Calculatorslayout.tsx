import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, HelpCircle, Sigma, Lightbulb } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface CalculatorsLayoutProps {
  title: string;
  description?: React.ReactNode;
  inputSection: React.ReactNode;
  resultSection: React.ReactNode;
  infoSection: {
    calculatorDescription: React.ReactNode;
    calculationFormula: React.ReactNode;
    containerSpecifications?: React.ReactNode;
    usefulTips: React.ReactNode;
  };
}

const CalculatorsLayout: React.FC<CalculatorsLayoutProps> = ({
  title,
  description,
  inputSection,
  resultSection,
  infoSection,
}: CalculatorsLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBackClick = () => {
    const pathSegments = (pathname || '').split('/').filter(segment => segment !== '');
    if (pathSegments.length > 1) {
      const parentPath = '/' + pathSegments.slice(0, -1).join('/');
      router.push(parentPath);
    } else {
      router.push('/'); // 최상위 경로인 경우 홈으로 이동
    }
  };

  const infoItems = [
    {
      value: 'description',
      title: '계산기 설명',
      content: infoSection.calculatorDescription,
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      value: 'formula',
      title: '계산 공식',
      content: infoSection.calculationFormula,
      icon: <Sigma className="w-5 h-5" />,
    },

    {
      value: 'tips',
      title: '유용한 팁',
      content: infoSection.usefulTips,
      icon: <Lightbulb className="w-5 h-5" />,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="text-center mb-6 relative">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2"
          onClick={handleBackClick}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>정보 입력</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-4">
            {inputSection}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>계산 결과</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-4">
            {resultSection}
          </CardContent>
        </Card>
      </div>

      <Accordion
        type="multiple"
        defaultValue={infoItems.map(item => item.value)}
        className="w-full space-y-4"
      >
        {infoItems.map((item) => (
          <AccordionItem 
            value={item.value} 
            key={item.value}
            className="border rounded-lg bg-card"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline p-4 data-[state=open]:bg-accent/20 rounded-lg">
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-left">{item.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <div className="accordion-content-optimized">
                {item.content}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CalculatorsLayout;