import { statusInfo } from '../utils/status';
export function Legend() { return <section><p className="section-label">Legend</p><div className="space-y-2">{[1, 2, 0].map(key => <div key={key} className="flex items-center gap-2 text-sm text-slate-600"><span className={`h-2.5 w-2.5 rounded-full ${statusInfo[key as 0|1|2].color}`} />{statusInfo[key as 0|1|2].label}</div>)}</div></section>; }
