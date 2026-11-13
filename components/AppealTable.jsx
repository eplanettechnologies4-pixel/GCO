import { appeal, appealTotals, fmt } from '@/lib/site';

export default function AppealTable() {
  const t = appealTotals();
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white card-shadow">
      <table className="w-full text-sm text-center">
        <thead className="bg-navy text-white">
          <tr>
            <th className="py-3 px-3 text-left">Item</th>
            <th className="py-3 px-3">Qty</th>
            <th className="py-3 px-3">Unit (PKR)</th>
            <th className="py-3 px-3">Total (PKR)</th>
            <th className="py-3 px-3">Unit (USD)</th>
            <th className="py-3 px-3">Total (USD)</th>
          </tr>
        </thead>
        <tbody>
          {appeal.items.map((r) => (
            <tr key={r.item} className="border-t border-slate-100">
              <td className="py-3 px-3 text-left font-semibold text-navy">{r.item}</td>
              <td className="py-3 px-3">{r.qty}</td>
              <td className="py-3 px-3">{fmt(r.unitPkr)}</td>
              <td className="py-3 px-3">{fmt(r.totalPkr)}</td>
              <td className="py-3 px-3">{r.unitUsd.toFixed(2)}</td>
              <td className="py-3 px-3">{r.totalUsd.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-silver bg-bgsilver font-bold text-navy">
            <td className="py-3 px-3 text-left" colSpan={3}>Total Estimated Budget</td>
            <td className="py-3 px-3">{fmt(t.pkr)}</td>
            <td className="py-3 px-3"></td>
            <td className="py-3 px-3">{t.usd.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
