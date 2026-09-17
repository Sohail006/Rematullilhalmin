const PAKISTAN_TIMEZONE = "Asia/Karachi";

function toDate(value: Date | string | number) {
  return value instanceof Date ? value : new Date(value);
}

function localeTag(locale?: string) {
  return locale?.startsWith("ur") ? "ur-PK" : "en-PK";
}

/** Date only in Pakistan Standard Time, e.g. 17 Sep 2026 */
export function formatDatePK(
  value: Date | string | number,
  locale?: string,
) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    timeZone: PAKISTAN_TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(toDate(value));
}

/** Date + time in Pakistan Standard Time, e.g. 17 Sep 2026, 08:30 pm */
export function formatDateTimePK(
  value: Date | string | number,
  locale?: string,
) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    timeZone: PAKISTAN_TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(toDate(value));
}

/** Current calendar year in Pakistan Standard Time */
export function currentYearPK() {
  return Number(
    new Intl.DateTimeFormat("en-PK", {
      timeZone: PAKISTAN_TIMEZONE,
      year: "numeric",
    }).format(new Date()),
  );
}
