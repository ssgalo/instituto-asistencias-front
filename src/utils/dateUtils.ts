export const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString); 
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };
  
  return date.toLocaleDateString('es-AR', options);
};