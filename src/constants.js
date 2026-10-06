export const PRIORITIES = {
  low:    { label: 'ต่ำ',     badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800', bar: 'bg-emerald-500' },
  medium: { label: 'ปานกลาง', badge: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800', bar: 'bg-amber-500' },
  high:   { label: 'สูง',     badge: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:ring-rose-800', bar: 'bg-rose-500' },
};
export const ORDER = ['low', 'medium', 'high'];

export const CATS = {
  work:     { label: 'งาน',     dot: 'bg-sky-500',    tag: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
  personal: { label: 'ส่วนตัว',  dot: 'bg-violet-500', tag: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300' },
  shopping: { label: 'ช็อปปิง', dot: 'bg-pink-500',   tag: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300' },
  health:   { label: 'สุขภาพ',  dot: 'bg-teal-500',   tag: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300' },
};

export const FILTERS = [['all', 'ทั้งหมด'], ['active', 'ยังไม่เสร็จ'], ['done', 'เสร็จแล้ว']];

export const DUE_STYLE = {
  overdue: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:ring-rose-800',
  today:   'bg-yellow-50 text-yellow-800 ring-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:ring-yellow-700',
  later:   'bg-neutral-100 text-neutral-600 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700',
  none:    'bg-neutral-100 text-neutral-400 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-500 dark:ring-neutral-700',
};

const pad = (n) => String(n).padStart(2, '0');
export const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const offsetDay = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d); };
export const fmtDate = (s) => new Date(s + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });

export const dueState = (t) => {
  if (!t.due || t.done) return 'none';
  const today = ymd(new Date());
  return t.due < today ? 'overdue' : t.due === today ? 'today' : 'later';
};
