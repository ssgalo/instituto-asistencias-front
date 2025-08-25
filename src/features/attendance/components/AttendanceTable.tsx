// src/features/attendance/components/AttendanceTable.tsx

import { useState, useMemo } from 'react';
import type { Attendee } from '../../../_mockData/attendees';
import { ArrowDown, ArrowUp } from 'lucide-react';

type SortDirection = 'ascending' | 'descending';
type SortKey = keyof Attendee;

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export const AttendanceTable = ({ data }: { data: Attendee[] }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) {
      return data;
    }
    const sorted = [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  const headers: { key: SortKey; label: string }[] = [
    { key: 'dni', label: 'DNI' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'nombre', label: 'Nombre' },
  ];

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-white uppercase bg-slate-700">
          <tr>
            {headers.map(({ key, label }) => (
              <th key={key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(key)}>
                <div className="flex items-center gap-2">
                  {label}
                  {getSortIcon(key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((attendee) => (
            <tr key={attendee.dni} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-600">
              <td className="px-6 py-4">{attendee.dni}</td>
              <td className="px-6 py-4 font-medium text-white">{attendee.apellido}</td>
              <td className="px-6 py-4">{attendee.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};