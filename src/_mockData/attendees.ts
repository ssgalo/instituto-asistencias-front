// src/_mockData/attendees.ts
export interface Attendee {
  dni: number;
  nombre: string;
  apellido: string;
  fechaAsistencia: string;
}

export const mockAttendees: Attendee[] = [
  { dni: 28123456, nombre: 'Ana', apellido: 'García', fechaAsistencia: '2024-08-16T09:05:00' },
  { dni: 32789012, nombre: 'Carlos', apellido: 'Martinez', fechaAsistencia: '2024-08-16T09:02:00' },
  { dni: 25456789, nombre: 'Laura', apellido: 'Rodriguez', fechaAsistencia: '2024-08-16T09:10:00' },
  { dni: 35012345, nombre: 'Pedro', apellido: 'Lopez', fechaAsistencia: '2024-08-16T09:00:00' },
  { dni: 29876543, nombre: 'Sofia', apellido: 'Fernandez', fechaAsistencia: '2024-08-16T09:08:00' },
];