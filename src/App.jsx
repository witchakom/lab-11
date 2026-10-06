import { useState, useRef } from 'react';
import { ListChecks, Plus, Search } from 'lucide-react';
import TodoItem from './components/TodoItem';
import Donut from './components/Donut';
import { PRIORITIES, ORDER, CATS, FILTERS, dueState, offsetDay } from './constants';

const initialTodos = () => [
  { id: 1, text: 'ส่งรายงานประจำสัปดาห์', done: false, priority: 'high', cat: 'work', due: offsetDay(-1) },
  { id: 2, text: 'ประชุมทีมโปรเจกต์', done: false, priority: 'medium', cat: 'work', due: offsetDay(0) },
  { id: 3, text: 'ซื้อผักและผลไม้', done: false, priority: 'low', cat: 'shopping', due: offsetDay(2) },
  { id: 4, text: 'นัดตรวจสุขภาพประจำปี', done: false, priority: 'medium', cat: 'health', due: offsetDay(7) },
  { id: 5, text: 'โทรหาคุณแม่', done: true, priority: 'low', cat: 'personal', due: '' },
];

const sideBtn = (active) =>
  'flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ' +
  (active
    ? 'bg-white dark:bg-neutral-900 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800');

const card = 'rounded-2xl bg-white dark:bg-neutral-900 shadow-md ring-1 ring-black/5 dark:ring-white/10 p-4 mb-5';
const field = 'rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-2 py-1 text-sm text-neutral-800 dark:text-neutral-200 outline-none focus:ring-2 focus:ring-indigo-500';

export default function App() {
  const nextId = useRef(6);
  const [todos, setTodos] = useState(initialTodos);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [cat, setCat] = useState('work');
  const [due, setDue] = useState('');
  const [filter, setFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [query, setQuery] = useState('');

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setTodos((ts) => [{ id: nextId.current++, text: t, done: false, priority, cat, due }, ...ts]);
    setText('');
    setDue('');
  };
  const toggle = (id) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const save = (id, txt) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, text: txt } : t)));
  const cycle = (id) =>
    setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, priority: ORDER[(ORDER.indexOf(t.priority) + 1) % 3] } : t)));

  // mark as removing first so the CSS exit animation can play, then drop it
  const removeWhere = (match) => {
    setTodos((ts) => ts.map((t) => (match(t) ? { ...t, removing: true } : t)));
    setTimeout(() => setTodos((ts) => ts.filter((t) => !match(t))), 280);
  };
  const remove = (id) => removeWhere((t) => t.id === id);
  const clearDone = () => removeWhere((t) => t.done);

  const total = todos.length;
  const doneCount = todos.filter((t) => t.done).length;
  const overdueCount = todos.filter((t) => dueState(t) === 'overdue').length;
  const activeCount = total - doneCount - overdueCount;
  const remaining = total - doneCount;
  const q = query.trim().toLowerCase();

  const shown = todos.filter(
    (t) =>
      (filter === 'all' || (filter === 'active' ? !t.done : t.done)) &&
      (catFilter === 'all' || t.cat === catFilter) &&
      (!q || t.text.toLowerCase().includes(q))
  );
  const statusCounts = { all: total, active: remaining, done: doneCount };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <header className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
          <ListChecks size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">รายการงานที่ต้องทำ</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">จัดการงานของคุณให้เป็นระเบียบ</p>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-[190px_1fr]">
        {/* Category sidebar */}
        <aside aria-label="หมวดหมู่">
          <div className="flex md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
            <button onClick={() => setCatFilter('all')} className={sideBtn(catFilter === 'all')}>
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
              <span className="flex-1 text-left">ทุกหมวด</span>
              <span className="text-xs opacity-60">{total}</span>
            </button>
            {Object.entries(CATS).map(([k, c]) => (
              <button key={k} onClick={() => setCatFilter(k)} className={sideBtn(catFilter === k)}>
                <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                <span className="flex-1 text-left">{c.label}</span>
                <span className="text-xs opacity-60">{todos.filter((t) => t.cat === k).length}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          {/* Stats */}
          <section className={`${card} flex items-center gap-4`}>
            <Donut done={doneCount} active={activeCount} overdue={overdueCount} total={total} />
            <div className="flex-1 min-w-0">
              <div className="flex gap-6 mb-2">
                <div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{total}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">งานทั้งหมด</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {total ? Math.round((doneCount / total) * 100) : 0}%
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">เสร็จแล้ว</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                <span className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-emerald-500" />เสร็จ {doneCount}</span>
                <span className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-indigo-500" />กำลังทำ {activeCount}</span>
                <span className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-rose-500" />เลยกำหนด {overdueCount}</span>
              </div>
            </div>
          </section>

          {/* Add form */}
          <section className={card}>
            <div className="flex gap-2">
              <input
                value={text} onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && add()}
                placeholder="เพิ่มงานใหม่..." aria-label="งานใหม่"
                className="flex-1 min-w-0 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent px-3.5 py-2.5 text-[15px] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={add} aria-label="เพิ่มงาน"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <Plus size={18} /><span className="hidden sm:inline">เพิ่ม</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
              <label className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                กำหนดส่ง
                <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className={field} style={{ colorScheme: 'light dark' }} />
              </label>
              <label className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                หมวด
                <select value={cat} onChange={(e) => setCat(e.target.value)} className={field}>
                  {Object.entries(CATS).map(([k, c]) => (
                    <option key={k} value={k} className="text-black">{c.label}</option>
                  ))}
                </select>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">ความสำคัญ</span>
                {ORDER.map((k) => (
                  <button
                    key={k} onClick={() => setPriority(k)} aria-pressed={priority === k}
                    className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-opacity ${PRIORITIES[k].badge} ${priority === k ? '' : 'opacity-40 hover:opacity-70'}`}
                  >
                    {PRIORITIES[k].label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Search */}
          <div className="relative mb-3 text-neutral-400">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหางาน..." aria-label="ค้นหางาน"
              className="w-full rounded-xl bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10 shadow-sm pl-9 pr-3 py-2.5 text-[15px] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status tabs */}
          <nav className="flex p-1 mb-4 rounded-xl bg-neutral-200/70 dark:bg-neutral-800" role="tablist">
            {FILTERS.map(([k, label]) => (
              <button
                key={k} role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${filter === k ? 'bg-white dark:bg-neutral-950 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}`}
              >
                {label} <span className="text-xs opacity-60">{statusCounts[k]}</span>
              </button>
            ))}
          </nav>

          <ul className="list-none p-0 m-0">
            {shown.map((t) => (
              <TodoItem key={t.id} todo={t} onToggle={toggle} onDelete={remove} onSave={save} onCyclePriority={cycle} />
            ))}
          </ul>

          {shown.length === 0 && (
            <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
              {q ? `ไม่พบงานที่ตรงกับ "${query.trim()}"` : total === 0 ? 'ยังไม่มีงาน พิมพ์ด้านบนเพื่อเพิ่มงานแรก' : 'ไม่มีงานในมุมมองนี้'}
            </div>
          )}

          <footer className="flex items-center justify-between mt-4 px-1 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
              เหลืออีก <b className="text-neutral-900 dark:text-neutral-100">{remaining}</b> งาน
            </span>
            <button
              onClick={clearDone} disabled={doneCount === 0}
              className="rounded-lg px-3 py-1.5 font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              ล้างงานที่เสร็จแล้ว
            </button>
          </footer>
          <p className="mt-6 text-center text-xs text-neutral-400">ดับเบิลคลิกที่ชื่องานเพื่อแก้ไข · แตะป้ายความสำคัญเพื่อเปลี่ยนระดับ</p>
        </div>
      </div>
    </main>
  );
}
