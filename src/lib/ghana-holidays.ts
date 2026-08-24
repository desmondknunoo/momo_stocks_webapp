/**
 * Ghana public holidays (GSE closed days).
 * Fixed-date holidays + computed Easter/Eid dates.
 */

function easterSunday(year: number): Date {
    // Anonymous Gregorian algorithm
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + days);
    return d;
}

/** Approximate Eid al-Fitr (1 Shawwal, lunar calendar). */
function eidAlFitr(year: number): Date {
    // Simplified: ~10 days earlier each year, anchored to known 2026 date.
    const known = new Date(Date.UTC(2026, 2, 31)); // Mar 31 2026
    const diff = (year - 2026) * -10.63;
    return addDays(known, Math.round(diff));
}

/** Approximate Eid al-Adha (10 Dhul Hijjah, lunar calendar). */
function eidAlAdha(year: number): Date {
    const known = new Date(Date.UTC(2026, 5, 7)); // Jun 7 2026
    const diff = (year - 2026) * -10.63;
    return addDays(known, Math.round(diff));
}

function toKey(d: Date): string {
    return d.toISOString().split("T")[0];
}

export function getGhanaHolidays(year: number): Set<string> {
    const holidays = new Set<string>();

    // Fixed-date holidays
    const fixed: [number, number][] = [
        [0, 1],   // New Year's Day
        [0, 7],   // Constitution Day
        [2, 6],   // Independence Day
        [4, 1],   // Labour Day
        [6, 1],   // Republic Day
        [11, 4],  // Farmer's Day
        [11, 25], // Christmas Day
        [11, 26], // Boxing Day
    ];

    for (const [month, day] of fixed) {
        const d = new Date(Date.UTC(year, month, day));
        // If落在周末, observed on next Monday
        const dow = d.getUTCDay();
        if (dow === 0) {
            holidays.add(toKey(addDays(d, 1)));
        } else if (dow === 6) {
            holidays.add(toKey(addDays(d, 2)));
        } else {
            holidays.add(toKey(d));
        }
    }

    // Easter-related (varies)
    const easter = easterSunday(year);
    holidays.add(toKey(addDays(easter, -2))); // Good Friday
    holidays.add(toKey(addDays(easter, 1)));  // Easter Monday

    // Eid al-Fitr (varies)
    const eidF = eidAlFitr(year);
    const eidFDow = eidF.getUTCDay();
    if (eidFDow === 0) holidays.add(toKey(addDays(eidF, 1)));
    else if (eidFDow === 6) holidays.add(toKey(addDays(eidF, 2)));
    else holidays.add(toKey(eidF));

    // Eid al-Adha (varies)
    const eidA = eidAlAdha(year);
    const eidADow = eidA.getUTCDay();
    if (eidADow === 0) holidays.add(toKey(addDays(eidA, 1)));
    else if (eidADow === 6) holidays.add(toKey(addDays(eidA, 2)));
    else holidays.add(toKey(eidA));

    // Founder's Day (Sep 21, observed next Monday if weekend)
    const founders = new Date(Date.UTC(year, 8, 21));
    const foundersDow = founders.getUTCDay();
    if (foundersDow === 0) holidays.add(toKey(addDays(founders, 1)));
    else if (foundersDow === 6) holidays.add(toKey(addDays(founders, 2)));
    else holidays.add(toKey(founders));

    return holidays;
}

export function isGhanaHoliday(dateStr: string, holidays?: Set<string>): boolean {
    if (!holidays) holidays = getGhanaHolidays(new Date(dateStr).getUTCFullYear());
    return holidays.has(dateStr);
}
