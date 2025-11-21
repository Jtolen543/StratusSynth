export function nowUTC(): Date {
    const n = new Date();
    return new Date(Date.UTC(
      n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(),
      n.getUTCHours(), n.getUTCMinutes(), n.getUTCSeconds(), 0
    ));
}
  
export function addMonthsUTC(d: Date, months: number): Date {
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    const day = d.getUTCDate();

    const target = new Date(Date.UTC(y, m + months, 1, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), 0));

    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    target.setUTCDate(Math.min(day, lastDay));
    return target;
}