import React from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  sortKey?: string | null;
  sortDirection?: SortDirection;
  onSort?: (key: string) => void;
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  stickyHeader?: boolean;
}

const SortIcon: React.FC<{ direction: SortDirection; active: boolean }> = ({ direction, active }) => (
  <svg
    width="0.875rem"
    height="0.875rem"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{
      flexShrink: 0,
      color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
      transition: 'color 150ms ease',
    }}
  >
    {direction === 'asc' && active ? (
      <path
        d="M8 4l-5 6h10L8 4z"
        fill="currentColor"
      />
    ) : direction === 'desc' && active ? (
      <path
        d="M8 12l5-6H3l5 6z"
        fill="currentColor"
      />
    ) : (
      <>
        <path
          d="M8 3l-3.5 4h7L8 3z"
          fill="currentColor"
          opacity="0.4"
        />
        <path
          d="M8 13l3.5-4H4.5L8 13z"
          fill="currentColor"
          opacity="0.4"
        />
      </>
    )}
  </svg>
);

const tableWrapperStyle: React.CSSProperties = {
  width: '100%',
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text)',
  backgroundColor: 'var(--color-white)',
};

const theadStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-bg-subtle, #f9fafb)',
};

const thBaseStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  fontWeight: 700,
  fontSize: 'var(--font-size-xs, 0.75rem)',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid var(--color-border)',
  whiteSpace: 'nowrap',
  userSelect: 'none',
};

const tdBaseStyle: React.CSSProperties = {
  padding: '0.875rem 1rem',
  borderBottom: '1px solid var(--color-border)',
  verticalAlign: 'middle',
};

const trStyle: React.CSSProperties = {
  transition: 'background-color 100ms ease',
};

const sortableThButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  background: 'none',
  border: 'none',
  padding: 0,
  margin: 0,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  color: 'inherit',
  letterSpacing: 'inherit',
  textTransform: 'inherit',
  whiteSpace: 'nowrap',
};

const emptyRowStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '3rem 1rem',
  color: 'var(--color-text-muted)',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--font-size-base)',
};

const loadingOverlayStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '3rem 1rem',
  color: 'var(--color-text-muted)',
};

const SpinnerInline: React.FC = () => (
  <>
    <style>{`@keyframes table-spin { to { transform: rotate(360deg); } }`}</style>
    <svg
      role="status"
      aria-label="Loading"
      width="1.5rem"
      height="1.5rem"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        display: 'inline-block',
        animation: 'table-spin 0.75s linear infinite',
        color: 'var(--color-primary)',
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="56.55"
        strokeDashoffset="14.14"
        opacity={0.25}
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="42.41 14.14"
        strokeDashoffset="0"
      />
    </svg>
  </>
);

function TableInner<T>(
  {
    columns,
    data,
    keyExtractor,
    sortKey = null,
    sortDirection = null,
    onSort,
    loading = false,
    emptyMessage = 'No data available.',
    style,
    className,
    stickyHeader = false,
  }: TableProps<T>,
  _ref: React.Ref<HTMLDivElement>
) {
  const handleSortClick = (key: string) => {
    if (onSort) {
      onSort(key);
    }
  };

  const alignMap: Record<string, React.CSSProperties['textAlign']> = {
    left: 'left',
    center: 'center',
    right: 'right',
  };

  const stickyHeaderStyle: React.CSSProperties = stickyHeader
    ? { position: 'sticky', top: 0, zIndex: 1 }
    : {};

  return (
    <div
      style={{ ...tableWrapperStyle, ...style }}
      className={className}
    >
      <table style={tableStyle} role="table">
        <thead style={{ ...theadStyle, ...stickyHeaderStyle }}>
          <tr>
            {columns.map((col) => {
              const isActive = sortKey === col.key;
              const thStyle: React.CSSProperties = {
                ...thBaseStyle,
                textAlign: col.align ? alignMap[col.align] : 'left',
                width: col.width,
              };

              return (
                <th key={col.key} scope="col" style={thStyle} aria-sort={
                  col.sortable
                    ? isActive
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : sortDirection === 'desc'
                        ? 'descending'
                        : 'none'
                      : 'none'
                    : undefined
                }>
                  {col.sortable && onSort ? (
                    <button
                      type="button"
                      style={sortableThButtonStyle}
                      onClick={() => handleSortClick(col.key)}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          'var(--color-text)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = '';
                      }}
                    >
                      {col.header}
                      <SortIcon
                        direction={isActive ? sortDirection : null}
                        active={isActive && sortDirection !== null}
                      />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={loadingOverlayStyle}>
                <SpinnerInline />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={emptyRowStyle}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={keyExtractor(row, index)}
                style={trStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                    'var(--color-bg-subtle, #f9fafb)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '';
                }}
              >
                {columns.map((col) => {
                  const tdStyle: React.CSSProperties = {
                    ...tdBaseStyle,
                    textAlign: col.align ? alignMap[col.align] : 'left',
                  };

                  return (
                    <td key={col.key} style={tdStyle}>
                      {col.render
                        ? col.render(row, index)
                        : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export const Table = React.forwardRef(TableInner) as <T>(
  props: TableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

export default Table;
