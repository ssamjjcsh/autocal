'use client';

import React from 'react';
import AdSlot from './AdSlot';

const RightAdRail: React.FC = () => {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slotTop = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT_TOP;
  const slotMiddle = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT_MIDDLE;
  const slotBottom = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT_BOTTOM;

  // 클라이언트 ID가 없으면 광고 레일 자체를 렌더링하지 않음
  if (!client) return null;

  return (
    <aside className="hidden xl:flex xl:flex-col xl:fixed xl:inset-y-0 xl:right-0 xl:z-40 w-80 bg-white border-l border-gray-200 p-3 overflow-y-auto">
      <div className="space-y-4">
        {/* 상단 큰 배너 (300x600 권장) */}
        {slotTop && (
          <div className="rounded-lg overflow-hidden border border-gray-200 p-2">
            <AdSlot slot={slotTop} />
          </div>
        )}

        {/* 중간 반응형 배너 (300x250 등) */}
        {slotMiddle && (
          <div className="rounded-lg overflow-hidden border border-gray-200 p-2">
            <AdSlot slot={slotMiddle} />
          </div>
        )}

        {/* 하단 세로 배너 */}
        {slotBottom && (
          <div className="rounded-lg overflow-hidden border border-gray-200 p-2">
            <AdSlot slot={slotBottom} format="vertical" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightAdRail;