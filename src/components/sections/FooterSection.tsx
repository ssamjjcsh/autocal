import React from 'react';
import Link from 'next/link';
import { Facebook, Youtube, Linkedin, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-10 mt-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
          {/* 왼쪽 섹션 - 로고 및 소셜 미디어 */}
          <div className="lg:w-3/10 mb-8 lg:mb-0">
            <div className="flex items-center mb-4">
              {/* 로고 이미지 또는 텍스트 */}
              <Image src="/logo/allincalc6.png" alt="AllinCalc Logo" width={250} height={100} />
            </div>
          </div>

          {/* 오른쪽 섹션 - 링크 그룹 */}
          <div className="lg:w-7/10 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="hidden sm:block"></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">프레스</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">편집 정책</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">파트너십</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AllinCalc 소개</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">소개</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">자료실</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">제휴</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">문의하기</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">블로그</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} AllinCalc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;