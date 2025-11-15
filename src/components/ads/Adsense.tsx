'use client';

import { useEffect } from 'react';

// Google Adsense 전역 변수 선언
const Adsense = () => {
  useEffect(() => {
    try {
      // @ts-ignore: Google Adsense 전역 변수
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (process.env.NEXT_PUBLIC_ADSENSE_CLIENT) {
    return (
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    );
  }

  return null;
};

export default Adsense;