import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  selectable?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  dense?: boolean;
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
}

export function Table<T extends { id: string | number }>({
  columns,
  data,
  selectable = false,
  onRowClick,
  emptyMessage = 'No data available',
  dense = false,
  sortColumn: controlledSortColumn,
  sortDirection: controlledSortDirection,
  onSort
}: TableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [internalSortColumn, setInternalSortColumn] = useState<string | null>(null);
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortColumn = controlledSortColumn !== undefined ? controlledSortColumn : internalSortColumn;
  const sortDirection = controlledSortDirection !== undefined ? controlledSortDirection : internalSortDirection;

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map(row => row.id)));
    }
  };

  const handleSelectRow = (id: string | number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSort = (columnKey: string) => {
    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';

    if (onSort) {
      onSort(columnKey, newDirection);
    } else {
      setInternalSortColumn(columnKey);
      setInternalSortDirection(newDirection);
    }
  };

  const rowPadding = dense ? 'py-2' : 'py-3';

  return (
    <div className="w-full overflow-auto rounded-lg border border-surface-a30 bg-surface-a10 dark:bg-surface-a20">
      <table className="w-full">
        <thead className="bg-tonal-a10 dark:bg-tonal-a20 border-b border-surface-a30">
          <tr>
            {selectable && (
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-surface-a40 text-primary-a30 focus:ring-primary-a30/25 bg-surface-a10"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider",
                  column.sortable && "cursor-pointer hover:bg-surface-a20 dark:hover:bg-surface-a30"
                )}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {column.sortable && sortColumn === column.key && (
                    <span className="text-text-muted">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-a30">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "transition-colors",
                  onRowClick && "cursor-pointer hover:bg-surface-a20 dark:hover:bg-surface-a30"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td className={`px-4 ${rowPadding}`} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="rounded border-surface-a40 text-primary-a30 focus:ring-primary-a30/25 bg-surface-a10"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 ${rowPadding} text-sm text-text-primary`}>
                    {column.render ? column.render(row) : (row as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
