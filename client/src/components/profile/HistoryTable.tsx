import type { HistoryItem } from "../../api/user.api";

interface HistoryTableProps {
  items: HistoryItem[];
}

export function HistoryTable({ items }: HistoryTableProps) {
  if (items.length === 0) {
    return <p className="text-fg-muted">No games played yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="mx-auto w-full max-w-md border-collapse text-left">
        <thead>
          <tr className="border-b border-line text-sm text-fg-muted">
            <th className="px-3 py-2 font-medium">Mode</th>
            <th className="px-3 py-2 font-medium text-right">Score</th>
            <th className="px-3 py-2 font-medium text-right">Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-line/50">
              <td className="px-3 py-2 text-fg">{item.mode}</td>
              <td className="px-3 py-2 text-right font-mono text-primary">
                {item.score}
                {item.isSuspicious && (
                  <span title="Flagged by anti-cheat checks"> ⚠️</span>
                )}
              </td>
              <td className="px-3 py-2 text-right text-sm text-fg-muted">
                {new Date(item.submittedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
