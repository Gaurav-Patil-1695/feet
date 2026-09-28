import React from 'react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  style?: React.CSSProperties;
  className?: string;
}

const ChevronLeftIcon: React.FC = () => (
  <svg
    width="1rem"
    height="1rem"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M10 12L6 8l4-4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg
    width="1rem"
    height="1rem"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function buildPageRange(
  page: number,
  totalPages: number,
  siblingCount: number
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(page - siblingCount, 1);
  const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis-end', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + 1 + i
    );
    return [1, 'ellipsis-start', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, 'ellipsis-start', ...middleRange, 'ellipsis-end', totalPages];
}

const basePageButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '2rem',
  height: '2rem',
  padding: '0 0.375rem',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 500,
  borderRadius: 'var(--radius-sm)',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
  userSelect: 'none',
  lineHeight: 1,
};

const navButtonStyle: React.CSSProperties = {
  ...basePageButtonStyle,
  color: 'var(--color-text-muted)',
  backgroundColor: 'var(--color-white)',
  borderColor: 'var(--color-border)',
};

const defaultPageButtonStyle: React.CSSProperties = {
  ...basePageButtonStyle,
  color: 'var(--color-text)',
  backgroundColor: 'transparent',
  borderColor: 'transparent',
};

const activePageButtonStyle: React.CSSProperties = {
  ...basePageButtonStyle,
  color: 'var(--color-white)',
  backgroundColor: 'var(--color-primary)',
  borderColor: 'var(--color-primary)',
  fontWeight: 700,
  cursor: 'default',
};

const disabledNavButtonStyle: React.CSSProperties = {
  ...navButtonStyle,
  opacity: 0.4,
  cursor: 'not-allowed',
  pointerEvents: 'none',
};

const ellipsisStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '2rem',
  height: '2rem',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-muted)',
  userSelect: 'none',
  letterSpacing: '0.05em',
};

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  style,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pageRange = buildPageRange(page, totalPages, siblingCount);

  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontFamily: 'var(--font-sans)',
    ...style,
  };

  const handlePageClick = (p: number) => {
    if (p !== page && p >= 1 && p <= totalPages) {
      onPageChange(p);
    }
  };

  return (
    <nav
      aria-label="Pagination"
      style={containerStyle}
      className={className}
    >
      <button
        type="button"
        aria-label="Go to previous page"
        onClick={() => handlePageClick(page - 1)}
        disabled={isPrevDisabled}
        style={isPrevDisabled ? disabledNavButtonStyle : navButtonStyle}
        onMouseEnter={(e) => {
          if (!isPrevDisabled) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'var(--color-bg-subtle, #f9fafb)';
            (e.currentTarget as HTMLButtonElement).style.color =
              'var(--color-text)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isPrevDisabled) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'var(--color-white)';
            (e.currentTarget as HTMLButtonElement).style.color =
              'var(--color-text-muted)';
          }
        }}
      >
        <ChevronLeftIcon />
      </button>

      {pageRange.map((item, idx) => {
        if (item === 'ellipsis-start' || item === 'ellipsis-end') {
          return (
            <span
              key={item}
              aria-hidden="true"
              style={ellipsisStyle}
            >
              &hellip;
            </span>
          );
        }

        const isActive = item === page;

        return (
          <button
            key={`${item}-${idx}`}
            type="button"
            aria-label={`Go to page ${item}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => handlePageClick(item)}
            disabled={isActive}
            style={isActive ? activePageButtonStyle : defaultPageButtonStyle}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'var(--color-bg-subtle, #f9fafb)';
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  'var(--color-border)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'transparent';
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  'transparent';
              }
            }}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Go to next page"
        onClick={() => handlePageClick(page + 1)}
        disabled={isNextDisabled}
        style={isNextDisabled ? disabledNavButtonStyle : navButtonStyle}
        onMouseEnter={(e) => {
          if (!isNextDisabled) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'var(--color-bg-subtle, #f9fafb)';
            (e.currentTarget as HTMLButtonElement).style.color =
              'var(--color-text)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isNextDisabled) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'var(--color-white)';
            (e.currentTarget as HTMLButtonElement).style.color =
              'var(--color-text-muted)';
          }
        }}
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
};

export default Pagination;
