'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
}

export default function ArticlePagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page') || '1');

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const PaginationLink = ({
    page,
    disabled,
    children,
  }: {
    page: number | string;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <Button
      variant={currentPage === page ? 'default' : 'outline'}
      size="icon"
      className={disabled ? 'pointer-events-none opacity-50' : ''}
      asChild
    >
      <Link href={createPageURL(page)} aria-disabled={disabled}>
        {children}
      </Link>
    </Button>
  );

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationLink key={i} page={i}>
          {i}
        </PaginationLink>
      );
    }

    return pageNumbers;
  };

  return (
    <nav
      className="mt-8 flex items-center justify-center space-x-2"
      aria-label="Pagination"
    >
      <PaginationLink page={currentPage - 1} disabled={currentPage <= 1}>
        <span className="sr-only">Previous page</span>
        <ChevronLeft className="h-4 w-4" />
      </PaginationLink>

      {currentPage > 3 && (
        <>
          <PaginationLink page={1}>1</PaginationLink>
          {currentPage > 4 && <span className="px-2">...</span>}
        </>
      )}

      {renderPageNumbers()}

      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && <span className="px-2">...</span>}
          <PaginationLink page={totalPages}>{totalPages}</PaginationLink>
        </>
      )}

      <PaginationLink
        page={currentPage + 1}
        disabled={currentPage >= totalPages}
      >
        <span className="sr-only">Next page</span>
        <ChevronRight className="h-4 w-4" />
      </PaginationLink>
    </nav>
  );
}
