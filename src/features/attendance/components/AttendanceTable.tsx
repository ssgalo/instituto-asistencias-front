// src/features/attendance/components/AttendanceTable.tsx

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, Eye, Trash2 } from 'lucide-react';
import type { Alumno } from '../../../types/Alumno';

type SortDirection = 'ascending' | 'descending';
type SortKey = keyof Alumno;

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export const AttendanceTable = ({ data, fechaClase, onDeleteClick }: { data: Alumno[], fechaClase: string | undefined, onDeleteClick: (alumno: Alumno) => void }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA == null) return 1;
      if (valueB == null) return -1;

      let comparison = 0;
      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }

      return sortConfig.direction === 'ascending' ? comparison : comparison * -1;
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

  const headers: { key: keyof Alumno | 'acciones'; label: string }[] = [
    { key: 'dni', label: 'DNI' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'acciones', label: 'Acciones' },
  ];

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-white uppercase bg-slate-700">
          <tr>
            {headers.map(({ key, label }) => (
              <th key={key} scope="col" className="px-6 py-3" onClick={() => key !== 'acciones' && requestSort(key as SortKey)}>
                <div className={`flex items-center gap-2 ${key !== 'acciones' ? 'cursor-pointer' : ''}`}>
                  {label}
                  {key !== 'acciones' && getSortIcon(key as SortKey)}
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
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <Link to={`/alumnos/${attendee.dni}`} state={{ from: `/clase/${fechaClase}/asistencias` }} className="text-teal-400 hover:text-teal-300">
                    <Eye size={20} />
                  </Link>
                  <button onClick={() => onDeleteClick(attendee)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};