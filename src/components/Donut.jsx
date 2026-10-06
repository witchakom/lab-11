export default function Donut({ done, active, overdue, total }) {
  const pct = (v) => (total ? (v / total) * 100 : 0);
  const segs = [
    [done, 'stroke-emerald-500'],
    [active, 'stroke-indigo-500'],
    [overdue, 'stroke-rose-500'],
  ];
  let offset = 25;

  return (
    <svg viewBox="0 0 36 36" className="w-24 h-24 shrink-0" role="img" aria-label="สัดส่วนสถานะงาน">
      <circle cx="18" cy="18" r="15.9155" fill="none" strokeWidth="4" className="stroke-neutral-200 dark:stroke-neutral-800" />
      {segs.map(([v, cls], i) => {
        const len = pct(v);
        const el = len > 0 && (
          <circle key={i} cx="18" cy="18" r="15.9155" fill="none" strokeWidth="4" className={cls}
            strokeDasharray={`${len} ${100 - len}`} strokeDashoffset={offset} />
        );
        offset -= len;
        return el;
      })}
      <text x="18" y="19.5" textAnchor="middle" className="fill-neutral-900 dark:fill-neutral-100"
        style={{ fontSize: '7px', fontWeight: 700 }}>
        {Math.round(pct(done))}%
      </text>
    </svg>
  );
}
