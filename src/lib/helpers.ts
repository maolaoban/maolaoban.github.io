export function trimText(input: string, maxLength: number = 100): string {
  if (input.length <= maxLength) return input;
  return input.substring(0, maxLength - 3) + "...";
}
export function getCurrentTimeInItaly(): Date {
  // Create a date object with the current UTC time
  const now = new Date();

  // Convert the UTC time to Italy's time
  const offsetItaly = 2; // Italy is in Central European Summer Time (UTC+2), but you might need to adjust this based on Daylight Saving Time
  now.setHours(now.getUTCHours() + offsetItaly);

  return now;
}

export function formatTimeForChina(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // This will format the time in 12-hour format with AM/PM
    timeZone: "Asia/Shanghai",
  };

  let formattedTime = new Intl.DateTimeFormat("zh", options).format(date);

  formattedTime += " CST";

  return formattedTime;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("zh", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
