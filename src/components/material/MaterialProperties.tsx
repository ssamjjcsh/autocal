"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { Search, ListChecks, X, Plus, Loader2 } from "lucide-react";
import { MaterialSelection } from '@/types/materialProperties';
import {
  MaterialsByCategory,
  PropertyKoreanNames,
  ElementKoreanNames,
} from '@/types/materialProperties';

interface MaterialPropertiesProps {
  materialsByCategory: MaterialsByCategory;
  propertyKoreanNames: PropertyKoreanNames;
  elementKoreanNames: ElementKoreanNames;
  sortPropertiesByOrder: (keys: string[]) => string[];
  sortElementsByOrder: (keys: string[]) => string[];
  allMaterials: MaterialSelection[];
}

// Helper function to format range values
const formatRangeValue = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) return '-';
  if (typeof value === 'number') return String(value);
  return value.replace(/ to /g, ' ~ ');
};

// Helper function to format units
const formatUnit = (unit: string): string => {
  return unit.replace(/(\^)(\d+)/g, '<sup>$2</sup>');
};

export default function MaterialProperties({
  materialsByCategory,
  propertyKoreanNames,
  elementKoreanNames,
  sortPropertiesByOrder,
  sortElementsByOrder,
  allMaterials,
}: MaterialPropertiesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(Object.keys(materialsByCategory)[0] || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<Array<MaterialSelection & { active: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredMaterials = useMemo(() => {
    if (!selectedCategory) return [];
    return (materialsByCategory[selectedCategory] || [])
      .filter((material: MaterialSelection) =>
        material.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [selectedCategory, searchTerm, materialsByCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  const handleSelectMaterial = (material: MaterialSelection) => {
    setSelectedMaterials(prev => {
      if (prev.some(m => m.id === material.id)) {
        return prev.filter(m => m.id !== material.id);
      }
      if (prev.length < 5) {
        return [...prev, { ...material, active: true }];
      }
      return prev;
    });
  };

  const handleRemoveMaterial = (materialId: string) => {
    setSelectedMaterials(prev => prev.filter(m => m.id !== materialId));
  };

  const toggleMaterialActive = (materialId: string) => {
    setSelectedMaterials(prev =>
      prev.map(m => (m.id === materialId ? { ...m, active: !m.active } : m))
    );
  };

  return (
    <TabsContent value="properties">
        <div className="space-y-6">
          {/* 재질 선택 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                재질 선택
              </CardTitle>
              <CardDescription>
                비교하고 싶은 재질을 최대 5개까지 선택해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <Select onValueChange={handleCategoryChange} defaultValue={selectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(materialsByCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-2/3">
                  <Input
                    placeholder="재질 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-4 max-h-60 overflow-y-auto border rounded-md p-2">
                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                  >
                    <span>{material.displayName}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSelectMaterial(material)}
                      disabled={
                        selectedMaterials.length >= 5 &&
                        !selectedMaterials.some((m) => m.id === material.id)
                      }
                    >
                      {selectedMaterials.some((m) => m.id === material.id)
                        ? "선택 해제"
                        : "선택"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 선택된 재질 목록 */}
          {selectedMaterials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ListChecks className="w-5 h-5 mr-2" />
                  선택된 재질
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                    >
                      <span>{material.displayName}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-2 h-auto w-auto p-0"
                        onClick={() => handleRemoveMaterial(material.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 물성 비교 섹션 */}
      {selectedMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Table className="w-5 h-5 mr-2" />
              재질 물성 비교
            </CardTitle>
            <CardDescription>
              선택된 재질들의 주요 물성 비교
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 활성/비활성 토글 */}
              <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                {selectedMaterials.map((material) => (
                  <div
                    key={material.id}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                      material.active ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    onClick={() => toggleMaterialActive(material.id)}
                  >
                    <span className={`w-3 h-3 rounded-full ${material.active ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                    <span className="text-sm font-medium">{material.displayName}</span>
                  </div>
                ))}
              </div>

              {/* 물성 비교 테이블 */}
              <div className="overflow-x-auto">
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full border-collapse table-fixed">
                    {/* 헤더 */}
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th 
                          className="text-left py-2 px-3 text-sm font-medium text-gray-600 bg-gray-50"
                          style={{ width: '300px' }}
                        >
                          물성
                        </th>
                        <th 
                            className="text-center py-2 px-3 text-sm font-medium text-gray-600 bg-gray-50"
                            style={{ width: '100px' }}
                          >
                            단위
                          </th>
                        {selectedMaterials.filter(m => m.active).map((material, index) => (
                          <th 
                            key={index} 
                            className="text-center py-2 px-3 text-sm font-medium text-gray-600 bg-blue-50"
                            style={{ width: `${100 / (selectedMaterials.filter(m => m.active).length + 2)}%` }}
                          >
                            <div className="truncate" title={material.displayName}>
                              {material.displayName}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    
                    {/* 물성 데이터 */}
                     <tbody>
                       {(() => {
                         // 모든 재료의 물성 키를 수집 (Alloy Composition과 Base Metal Price 제외)
                         const allPropertyKeys = new Set<string>();
                         selectedMaterials.filter(m => m.active).forEach(material => {
                           Object.keys(material.properties || {}).forEach(key => {
                             if (key !== 'Alloy Composition' && key !== 'Base Metal Price') {
                               allPropertyKeys.add(key);
                             }
                           });
                         });
                         
                         return sortPropertiesByOrder(Array.from(allPropertyKeys)).map((propertyKey) => {
                           const koreanInfo = propertyKoreanNames[propertyKey];
                           // 첫 번째 재료에서 단위 정보 가져오기
                           const firstMaterial = selectedMaterials.find(m => m.active && m.properties[propertyKey]);
                           const unit = firstMaterial?.properties[propertyKey]?.unit;
                           
                           return (
                             <tr key={propertyKey} className="border-b border-gray-100 hover:bg-gray-50">
                               <td className="py-1 px-3">
                                 <div className="text-xs font-medium text-gray-900 leading-tight">
                                   {koreanInfo?.korean ? `${koreanInfo.korean} (${propertyKey})` : propertyKey}
                                 </div>
                               </td>
                               <td className="py-1 px-3 text-center">
                                 <div className="text-xs text-gray-600 font-mono">
                                   {unit ? <span dangerouslySetInnerHTML={{ __html: formatUnit(unit) }} /> : '-'}
                                 </div>
                               </td>
                               {selectedMaterials.filter(m => m.active).map((material, index) => (
                                 <td key={index} className="py-1 px-3 text-center">
                                   <div className="text-xs font-medium text-gray-900">
                                     {formatRangeValue(material.properties[propertyKey]?.value || '-')}
                                   </div>
                                 </td>
                               ))}
                             </tr>
                           );
                         });
                       })()}
                     </tbody>
                  </table>
                </div>
              </div>

              {/* COMPOSITION 섹션 */}
              {(() => {
                // 안전한 composition 데이터 파싱 함수
                const parseCompositionData = (compositionString: string): Array<{symbol: string, percentage: string}> => {
                  if (!compositionString) return [];
                  
                  try {
                    // JSON 형태로 파싱 시도
                    const parsed = JSON.parse(compositionString);
                    if (Array.isArray(parsed)) {
                      return parsed.filter(item => item.symbol && item.percentage);
                    }
                  } catch (error) {
                    // JSON 파싱 실패 시 텍스트 파싱 시도
                    console.warn('JSON 파싱 실패, 텍스트 파싱 시도:', error);
                    
                    // 텍스트에서 원소와 퍼센트 추출 시도
                    // 예: "C: 0.08%, Cr: 18-20%, Ni: 8-10.5%" 형태
                    const elements: Array<{symbol: string, percentage: string}> = [];
                    
                    // 쉼표로 분리하여 각 원소 처리
                    const parts = compositionString.split(',');
                    for (const part of parts) {
                      const trimmed = part.trim();
                      // "원소명: 퍼센트%" 패턴 매칭
                      const match = trimmed.match(/([A-Za-z]+)\\s*:\\s*([0-9.-]+(?:\\s*to\\s*[0-9.-]+)?)\\s*%?/);
                      if (match) {
                        elements.push({
                          symbol: match[1],
                          percentage: match[2] + '%'
                        });
                      }
                    }
                    
                    if (elements.length > 0) {
                      return elements;
                    }
                  }
                  
                  return [];
                };

                // 모든 재료의 합금 원소를 수집
                const allElements = new Set<string>();
                selectedMaterials.filter(m => m.active && m.composition).forEach(material => {
                  if (material.composition?.Composition) {
                    const compositionData = parseCompositionData(material.composition.Composition);
                    compositionData.forEach(element => {
                      allElements.add(element.symbol);
                    });
                  }
                });

                const sortedElements = sortElementsByOrder(Array.from(allElements));

                if (sortedElements.length === 0) return null;

                return (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-600 border-b border-green-200 pb-2">
                      Chemical Composition
                    </h3>
                    
                    {/* 모바일에서는 카드 레이아웃, 데스크톱에서는 테이블 */}
                    <div className="block sm:hidden">
                      {/* 모바일 카드 레이아웃 */}
                      <div className="space-y-4">
                        {sortedElements.map((symbol, elementIndex) => (
                          <div key={elementIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="mb-3">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {elementKoreanNames[symbol] ? `${elementKoreanNames[symbol]}` : symbol}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {symbol} (%)
                              </p>
                            </div>
                            <div className="space-y-2">
                              {selectedMaterials.filter(m => m.active).map((material, materialIndex) => {
                                // 해당 재료의 composition 데이터 파싱
                                const compositionData = material.composition?.Composition 
                                  ? parseCompositionData(material.composition.Composition)
                                  : [];
                                
                                // 해당 원소의 데이터 찾기
                                const elementData = compositionData.find(element => element.symbol === symbol);
                                
                                const value = elementData 
                                  ? elementData.percentage.replace(/ to /g, '~').replace(/%/g, '')
                                  : '-';

                                return (
                                  <div key={materialIndex} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-[60%]">
                                      {material.displayName}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">
                                      {value}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 데스크톱 테이블 레이아웃 */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full border-collapse table-fixed">
                        {/* 헤더 */}
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th 
                              className="text-left py-2 px-3 text-sm font-medium text-gray-600 bg-gray-50"
                              style={{ width: '300px' }}
                            >
                              원소
                            </th>
                            <th 
                              className="text-center py-2 px-3 text-sm font-medium text-gray-600 bg-gray-50"
                              style={{ width: '100px' }}
                            >
                              단위
                            </th>
                            {selectedMaterials.filter(m => m.active).map((material, index) => (
                              <th 
                                key={index} 
                                className="text-center py-2 px-3 text-sm font-medium text-gray-600 bg-green-50"
                                style={{ width: `${100 / (selectedMaterials.filter(m => m.active).length + 2)}%` }}
                              >
                                <div className="truncate" title={material.displayName}>
                              {material.displayName}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        
                        {/* 원소별 데이터 */}
                        <tbody>
                          {sortedElements.map((symbol, elementIndex) => (
                            <tr key={elementIndex} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-1 px-3">
                                <div className="text-xs font-medium text-gray-900 leading-tight">
                                  {elementKoreanNames[symbol] ? `${elementKoreanNames[symbol]}(${symbol})` : symbol}
                                </div>
                              </td>
                              <td className="py-1 px-3 text-center">
                                <div className="text-xs text-gray-600 font-mono">
                                  %
                                </div>
                              </td>
                              {selectedMaterials.filter(m => m.active).map((material, materialIndex) => {
                                // 해당 재료의 composition 데이터 파싱
                                const compositionData = material.composition?.Composition 
                                  ? parseCompositionData(material.composition.Composition)
                                  : [];
                                
                                // 해당 원소의 데이터 찾기
                                const elementData = compositionData.find(element => element.symbol === symbol);
                                
                                const value = elementData 
                                  ? elementData.percentage.replace(/ to /g, '~').replace(/%/g, '')
                                  : '-';

                                return (
                                  <td key={materialIndex} className="py-1 px-3 text-center">
                                    <div className="text-xs font-medium text-gray-900">
                                      {value}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* BASE PRICE 섹션 */}
              {selectedMaterials.some(material => material.basePrice) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-purple-600 border-b border-purple-200 pb-2">
                    Reference Price
                  </h3>
                  
                  {/* 모바일에서는 카드 레이아웃, 데스크톱에서는 테이블 */}
                  <div className="block sm:hidden">
                    {/* 모바일 카드 레이아웃 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-900">
                          기본 금속 가격
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Base Metal Price ({selectedMaterials.find(m => m.active && m.basePrice)?.basePrice?.unit === '%' ? '%rel' : selectedMaterials.find(m => m.active && m.basePrice)?.basePrice?.unit || '-'})
                        </p>
                      </div>
                      <div className="space-y-2">
                        {selectedMaterials.filter(m => m.active).map((material, index) => (
                          <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[60%]">
                              {material.displayName}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {material.basePrice ? formatRangeValue(material.basePrice.value) : '-'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 데스크톱 테이블 레이아웃 */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full border-collapse table-fixed">
                      {/* 헤더 */}
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th 
                            className="text-left py-2 px-3 text-sm font-medium text-gray-600 bg-gray-50"
                            style={{ width: '300px' }}
                          >
                            가격 지수
                          </th>
                          <th 
                            className="text-center py-2 px-3 text-sm font-medium text-gray-600 bg-gray-50"
                            style={{ width: '100px' }}
                          >
                            단위
                          </th>
                          {selectedMaterials.filter(m => m.active).map((material, index) => (
                            <th 
                              key={index} 
                              className="text-center py-2 px-3 text-sm font-medium text-gray-600 bg-blue-50"
                              style={{ width: `${100 / (selectedMaterials.filter(m => m.active).length + 2)}%` }}
                            >
                              <div className="truncate" title={material.displayName}>
                                {material.displayName}
                              </div>
                            </th>
                          ))}\
                        </tr>
                      </thead>
                      
                      {/* 가격 데이터 */}
                      <tbody>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3">
                            <div className="text-xs font-medium text-gray-900">
                              기본 금속 가격
                            </div>
                            <div className="text-xs text-gray-500">
                              Base Metal Price
                            </div>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <div className="text-xs text-gray-600">
                              {selectedMaterials.find(m => m.active && m.basePrice)?.basePrice?.unit === '%' ? '%rel' : selectedMaterials.find(m => m.active && m.basePrice)?.basePrice?.unit || '-'}
                            </div>
                          </td>
                          {selectedMaterials.filter(m => m.active).map((material, index) => (
                            <td key={index} className="py-2 px-3 text-center">
                              <div className="text-xs text-gray-700">
                                {material.basePrice ? formatRangeValue(material.basePrice.value) : '-'}
                              </div>
                            </td>
                          ))}\
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 빈 상태 메시지 */}
      {selectedMaterials.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">재질을 선택해주세요</p>
              <p className="text-sm">
                  위에서 재질을 선택하면 물성 정보를 비교할 수 있습니다.
                </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>데이터를 로드하는 중...</span>
        </div>
      )}
        </div>
      </TabsContent>
  );
}