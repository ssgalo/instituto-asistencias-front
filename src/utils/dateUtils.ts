export const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};