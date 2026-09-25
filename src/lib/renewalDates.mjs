function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

function iso(date) {
  return date.toISOString().slice(0, 10);
}

/** Estimate the March 31 / September 30 date on or before the second anniversary. */
export function estimateRenewalDates(licensedOn, dbprFirstExpiration = '') {
  const issued = parseDate(licensedOn);
  if (!issued) throw new Error('Enter a valid Florida license issue date.');

  const secondAnniversary = new Date(Date.UTC(
    issued.getUTCFullYear() + 2,
    issued.getUTCMonth(),
    Math.min(issued.getUTCDate(), new Date(Date.UTC(issued.getUTCFullYear() + 2, issued.getUTCMonth() + 1, 0)).getUTCDate())
  ));
  const candidates = [];
  for (let year = issued.getUTCFullYear() + 1; year <= secondAnniversary.getUTCFullYear(); year++) {
    for (const [month, day] of [[2, 31], [8, 30]]) {
      const date = new Date(Date.UTC(year, month, day));
      if (date > issued && date <= secondAnniversary) candidates.push(date);
    }
  }
  const estimate = candidates.at(-1);
  if (!estimate) throw new Error('Check the license issue date and try again.');

  let first = estimate;
  if (dbprFirstExpiration) {
    const official = parseDate(dbprFirstExpiration);
    if (!official || official <= issued || !([2, 8].includes(official.getUTCMonth()) &&
      (official.getUTCMonth() === 2 ? official.getUTCDate() === 31 : official.getUTCDate() === 30))) {
      throw new Error('The DBPR expiration date must be a valid March 31 or September 30 after your issue date.');
    }
    first = official;
  }

  const next = new Date(Date.UTC(first.getUTCFullYear() + 2, first.getUTCMonth(), first.getUTCDate()));
  return {
    first: iso(first),
    next: iso(next),
    secondAnniversary: iso(secondAnniversary),
    fromDbpr: Boolean(dbprFirstExpiration),
  };
}
