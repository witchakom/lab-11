import { useState } from 'react';
import { Check, Trash2, CalendarDays } from 'lucide-react';
import { PRIORITIES, CATS, DUE_STYLE, dueState, fmtDate } from '../constants';

export default function TodoItem({ todo, onToggle, onDelete, onSave, onCyclePriority }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const p = PRIORITIES[todo.priority];
  const c = CATS[todo.cat];
  const ds = dueState(todo);
  const dueLabel = ds === 'overdue' ? `เลยกำหนด ${fmtDate(todo.due)}` : ds === 'today' ? 'วันนี้' : fmtDate(todo.due);

  const commit = () => {
    const t = draft.trim();
    if (t) onSave(todo.id, t); else setDraft(todo.text);
    setEditing(false);
  };

  return (
    <li className={`item in mb-2.5 ${todo.removing ? 'out' : ''}`} style={{ maxHeight: 160 }}>
      <div className="relative flex items-start gap-3 rounded-xl bg-white dark:bg-neutral-900 shadow-sm ring-1 ring-black/5 dark:ring-white/10 pl-4 pr-2 py-3 overflow-hidden">
        <span className={`absolute left-0 top-0 h-full w-1 ${p.bar}`} />

        <button
          role="checkbox" aria-checked={todo.done} aria-label="ทำเครื่องหมายว่าเสร็จ"
          onClick={() => onToggle(todo.id)}
          className={`shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${todo.done ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-neutral-300 dark:border-neutral-600'}`}
        >
          {todo.done && <Check size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              autoFocus value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit();
                if (e.key === 'Escape') { setDraft(todo.text); setEditing(false); }
              }}
              className="w-full rounded-md border border-indigo-300 dark:border-indigo-700 bg-transparent px-2 py-1 text-[15px] text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <span
              onDoubleClick={() => { setDraft(todo.text); setEditing(true); }}
              title="ดับเบิลคลิกเพื่อแก้ไข"
              className={`block break-words text-[15px] cursor-text select-none ${todo.done ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-neutral-100'}`}
            >
              {todo.text}
            </span>
          )}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${c.tag}`}>{c.label}</span>
            {todo.due && (
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${DUE_STYLE[ds]}`}>
                <CalendarDays size={12} />{dueLabel}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onCyclePriority(todo.id)} title="แตะเพื่อเปลี่ยนความสำคัญ"
          className={`shrink-0 mt-0.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${p.badge}`}
        >
          {p.label}
        </button>

        <button
          onClick={() => onDelete(todo.id)} aria-label="ลบงาน"
          className="shrink-0 p-2 -mt-0.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}
