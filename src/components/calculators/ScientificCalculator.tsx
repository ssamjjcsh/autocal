'use client';
import React, { useState } from 'react';
import * as math from 'mathjs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [mode, setMode] = useState('deg');
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);

  const handleButtonClick = (value: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setLastResult(null);
    setHistory([]);
  };

  const handleBackspace = () => {
    if (display.length === 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const normalizeExpression = (expr: string): string => {
    // 사용자 친화적인 표현식을 mathjs가 이해할 수 있는 표현식으로 변환
    let normalized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/x/g, '*')
      .replace(/\^/g, '^')
      .replace(/π/g, 'pi')
      .replace(/e/g, 'e')
      .replace(/exp\(/g, 'e^(');

    // 삼각함수 처리
    if (mode === 'deg') {
      // 도(degree)를 라디안으로 변환
      normalized = normalized
        .replace(/sin\(([^)]+)\)/g, 'sin($1 * pi / 180)')
        .replace(/cos\(([^)]+)\)/g, 'cos($1 * pi / 180)')
        .replace(/tan\(([^)]+)\)/g, 'tan($1 * pi / 180)')
        .replace(/asin\(([^)]+)\)/g, 'asin($1) * 180 / pi')
        .replace(/acos\(([^)]+)\)/g, 'acos($1) * 180 / pi')
        .replace(/atan\(([^)]+)\)/g, 'atan($1) * 180 / pi');
    }

    // 기타 수학 함수 처리
    normalized = normalized
      .replace(/ln\(([^)]+)\)/g, 'log($1)')
      .replace(/log\(([^)]+)\)/g, 'log10($1)')
      .replace(/√\(([^)]+)\)/g, 'sqrt($1)')
      .replace(/³√\(([^)]+)\)/g, 'cbrt($1)')
      .replace(/10\^\(([^)]+)\)/g, '10^($1)')
      .replace(/ʸ√x/g, '^(1/')
      .replace(/³√x/g, '^(1/3)')
      .replace(/n!\(\)/g, 'factorial');

    return normalized;
  };

  const handleEquals = () => {
    try {
      if (display.includes('=')) {
        // 이미 계산 결과가 표시된 경우
        return;
      }

      let expression = display;
      
      // 열린 괄호와 닫힌 괄호의 개수를 세어 자동으로 닫는 괄호 추가
      const openParenthesesCount = (expression.match(/\(/g) || []).length;
      const closeParenthesesCount = (expression.match(/\)/g) || []).length;
      const missingParentheses = openParenthesesCount - closeParenthesesCount;

      if (missingParentheses > 0) {
        for (let i = 0; i < missingParentheses; i++) {
          expression += ')';
        }
      }

      // 사용자 입력을 정규화
      expression = normalizeExpression(expression);
      
      // mathjs를 사용하여 계산
      const result = math.evaluate(expression);
      
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        setLastResult(result);
        setHistory(prev => [...prev.slice(-2), `${display} = ${result}`]);
        setDisplay(result.toString());
      } else {
        setDisplay('Error');
      }
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleSpecialButton = (button: string) => {
    switch (button) {
      case 'Ans':
        if (lastResult !== null) {
          setDisplay(lastResult.toString());
        }
        break;
      case 'π':
        setDisplay(math.pi.toString());
        break;
      case 'e':
        setDisplay(math.e.toString());
        break;
      case '±':
        if (display !== '0' && display !== 'Error') {
          if (display.startsWith('-')) {
            setDisplay(display.slice(1));
          } else {
            setDisplay('-' + display);
          }
        }
        break;
      case '1/x':
        try {
          const value = parseFloat(display);
          if (value !== 0) {
            const result = 1 / value;
            setDisplay(result.toString());
          } else {
            setDisplay('Error');
          }
        } catch {
          setDisplay('Error');
        }
        break;
      case '%':
        try {
          const value = parseFloat(display);
          const result = value / 100;
          setDisplay(result.toString());
        } catch {
          setDisplay('Error');
        }
        break;
      case 'n!':
        try {
          const value = parseFloat(display);
          if (value < 0 || value % 1 !== 0) {
            setDisplay('Error');
          } else {
            const result = math.factorial(value);
            setDisplay(result.toString());
          }
        } catch {
          setDisplay('Error');
        }
        break;
      case 'RND':
        const random = Math.random();
        setDisplay(random.toString());
        break;
      case 'M+':
        try {
          const value = parseFloat(display);
          setMemory(memory + value);
        } catch {
          setDisplay('Error');
        }
        break;
      case 'M-':
        try {
          const value = parseFloat(display);
          setMemory(memory - value);
        } catch {
          setDisplay('Error');
        }
        break;
      case 'MR':
        setDisplay(memory.toString());
        break;
      case 'x²':
        setDisplay(display + '^2');
        break;
      case 'x³':
        setDisplay(display + '^3');
        break;
      case 'xʸ':
        setDisplay(display + '^');
        break;
      case 'eˣ':
        setDisplay('exp(');
        break;
      case '10ˣ':
        setDisplay('10^(' + display + ')');
        break;
      case 'ʸ√x':
        setDisplay(display + '^(1/');
        break;
      case '³√x':
        setDisplay(display + '^(1/3)');
        break;
      case '√x':
        setDisplay('sqrt(' + display + ')');
        break;
      case 'ln':
        setDisplay('log(');
        break;
      case 'log':
        setDisplay('log10(');
        break;
      case 'sin':
        setDisplay('sin(');
        break;
      case 'cos':
        setDisplay('cos(');
        break;
      case 'tan':
        setDisplay('tan(');
        break;
      case 'sin⁻¹':
        setDisplay('asin(');
        break;
      case 'cos⁻¹':
        setDisplay('acos(');
        break;
      case 'tan⁻¹':
        setDisplay('atan(');
        break;
      case 'EXP':
        setDisplay(display + 'e');
        break;
      default:
        handleButtonClick(button);
    }
  };

  const getButtonClass = (button: string, span: number = 1) => {
        const baseClass = `w-full h-10 text-xs font-bold m-1 truncate`;
    const spanClass = span > 1 ? `col-span-${span}` : '';

    const scientificButtons = ['sin', 'cos', 'tan', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'π', 'e', 'xʸ', 'x³', 'x²', 'eˣ', '10ˣ', 'ʸ√x', '³√x', '√x', 'ln', 'log'];
    const numberButtons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    const operatorButtons = ['+', '-', '×', '÷', 'EXP'];
    const actionButtons = ['Ans', 'M+', 'M-', 'MR', 'AC', '=', '⌫'];

    if (scientificButtons.includes(button)) {
      return `${baseClass} ${spanClass} bg-blue-100 text-blue-800 hover:bg-blue-200`;
    }
    if (numberButtons.includes(button)) {
      return `${baseClass} ${spanClass} bg-gray-100 text-gray-800 hover:bg-gray-200`;
    }
    if (operatorButtons.includes(button)) {
      return `${baseClass} ${spanClass} bg-gray-100 text-gray-800 hover:bg-gray-200`;
    }
    if (actionButtons.includes(button)) {
      return `${baseClass} ${spanClass} bg-blue-500 text-white hover:bg-blue-600`;
    }
    if (['(', ')', '1/x', '%', 'n!', '±', 'RND'].includes(button)) {
        return `${baseClass} ${spanClass} bg-gray-100 text-gray-800 hover:bg-gray-200`;
    }

    return `${baseClass} ${spanClass} bg-gray-200 text-gray-800 hover:bg-gray-300`;
  };

  const buttonLayout = [
    ['sin', 'cos', 'tan', '7', '8', '9', '+', '⌫'],
    ['sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'π', 'e', '4', '5', '6', '-', 'Ans'],
    ['xʸ', 'x³', 'x²', 'eˣ', '10ˣ', '1', '2', '3', '×', 'M+'],
    ['ʸ√x', '³√x', '√x', 'ln', 'log', { label: '0', span: 2 }, '.', 'EXP', '÷', 'M-'],
    ['(', ')', '1/x', '%', 'n!', '±', 'RND', 'AC', { label: '=', span: 2 }, 'MR'],
  ];

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <RadioGroup defaultValue="deg" className="flex" onValueChange={setMode}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="deg" id="deg" />
              <Label htmlFor="deg">Deg</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rad" id="rad" />
              <Label htmlFor="rad">Rad</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* 계산 히스토리 */}
        {history.length > 0 && (
          <div className="mb-2 text-sm text-gray-500 max-h-20 overflow-y-auto">
            {history.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        )}
        
        <Input
          type="text"
          readOnly
          value={display}
          className="w-full h-12 text-3xl text-right mb-4 pr-4 bg-gray-100 rounded-md"
        />
        <div className="grid grid-cols-10 gap-1">
          {buttonLayout.flat().map((button, index) => {
            if (typeof button === 'object') {
              return (
                <Button
                  key={index}
                  className={getButtonClass(button.label, button.span)}
                  onClick={() => {
                    if (button.label === '=') {
                      handleEquals();
                    } else {
                      handleButtonClick(button.label);
                    }
                  }}
                >
                  {button.label}
                </Button>
              );
            }
            return (
              <Button
                key={index}
                className={getButtonClass(button)}
                onClick={() => {
                  if (button === 'AC') {
                    handleClear();
                  } else if (button === '=') {
                    handleEquals();
                  } else if (button === '⌫') {
                    handleBackspace();
                  } else if ([
                    'Ans', 'π', 'e', '±', '1/x', '%', 'n!', 'RND',
                    'M+', 'M-', 'MR', 'xʸ', 'x³', 'x²', 'eˣ', '10ˣ',
                    'ʸ√x', '³√x', '√x', 'ln', 'log', 'sin', 'cos', 'tan',
                    'sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'EXP'
                  ].includes(button)) {
                    handleSpecialButton(button);
                  } else {
                    handleButtonClick(button);
                  }
                }}
              >
                {button}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScientificCalculator;