import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { calculatorCategories } from '@/data/calculators';
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// Flatten calculators for search
const allCalculators = calculatorCategories.flatMap(category =>
  category.subcategories.flatMap(subcategory =>
    subcategory.calculators.map(calculator => ({
      ...calculator,
      categoryName: category.name,
      subcategoryName: subcategory.name,
    }))
  )
);

const orderedCategoryNames = [
  'finance',
  'life',
  'conversion',
  'science',
  'engineering',
  'material',
  'game',
  'others',
];

const navigation = orderedCategoryNames.map(name => {
    const category = calculatorCategories.find(c => c.id === name);
    return category ? { name: category.name, href: category.href, icon: category.icon } : null;
  }).filter(Boolean as any);

const Header: React.FC = () => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allCalculators>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        const results = allCalculators.filter(calc =>
          calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          calc.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          calc.subcategoryName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300); // Debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleResultClick = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b">
      {/* Top row: Logo, Search, Icons */}
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/logo/allincalc5.png" alt="AllinCalc Logo" width={60} height={18} />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">All-in-Calc</h1>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Search */}
          <div className="relative w-full max-w-lg" ref={searchRef}>
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border-0 bg-muted py-2.5 pl-10 pr-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                placeholder="Search for any calculator..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
            </div>
            {isSearchFocused && (
              <div className="absolute mt-1 w-full max-h-96 overflow-y-auto rounded-md bg-background border shadow-lg z-50">
                {searchResults.length > 0 ? (
                  <ul className="py-1">
                    {searchResults.map((calc) => (
                      <li key={calc.id}>
                        <Link
                          href={calc.href}
                          className="block px-4 py-2 text-sm hover:bg-muted"
                          onClick={handleResultClick}
                        >
                          <p className="font-semibold text-foreground">{calc.name}</p>
                          <p className="text-xs text-muted-foreground">{calc.categoryName} &gt; {calc.subcategoryName}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  searchQuery && <p className="p-4 text-sm text-muted-foreground">No results found.</p>
                )}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              type="button"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground focus:outline-none"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex items-center rounded-full text-sm focus:outline-none"
              id="user-menu-button"
            >
              <span className="sr-only">Open user menu</span>
              <UserIcon className="h-8 w-8 rounded-full text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Navigation */}
      <div className="border-t">
        <nav className="container mx-auto flex items-center justify-center space-x-8 py-3">
          {navigation.map((item) => {
            if (!item) return null;
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-base font-medium transition-colors px-3 py-1 rounded-md ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-black hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;