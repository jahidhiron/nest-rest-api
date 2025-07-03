export const timestampWithTimezone = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const timezoneOffset = date.getTimezoneOffset();
  const timezoneSign = timezoneOffset > 0 ? '-' : '+';
  const absOffset = Math.abs(timezoneOffset);
  const timezoneOffsetHours = String(Math.floor(absOffset / 60)).padStart(
    2,
    '0',
  );
  const timezoneOffsetMinutes = String(absOffset % 60).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${timezoneSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;

  return formattedDate;
};
