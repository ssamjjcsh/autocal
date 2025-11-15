'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdSlotProps {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: 'true' | 'false';
}

const AdSlot: React.FC<AdSlotProps> = ({
  slot,
  className,
  style,
  format = 'auto',
  fullWidthResponsive = 'true',
}) => {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AdSlot] NEXT_PUBLIC_ADSENSE_CLIENT이 설정되지 않았습니다. 광고가 표시되지 않습니다.');
      }
      return;
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('[AdSlot] adsbygoogle push 실패:', e);
    }
  }, [client, slot]);

  if (!client) {
    // 클라이언트 ID가 없으면 렌더링하지 않음
    return null;
  }

  return (
    <ins
      className={`adsbygoogle ${className || ''}`}
      style={style || { display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive}
    />
  );
};

export default AdSlot;