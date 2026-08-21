import type { HistoryItem } from "../../api/user.api";

interface HistoryTableProps {
  items: HistoryItem[];
}

export function HistoryTable({ items }: HistoryTableProps) {
  if (items.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No games played yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="mx-auto w-full max-w-md border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
            <th className="px-3 py-2 font-medium">Mode</th>
            <th className="px-3 py-2 font-medium text-right">Score</th>
            <th className="px-3 py-2 font-medium text-right">Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 dark:border-gray-900"
            >
              <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                {item.mode}
              </td>
              <td className="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100">
                {item.score}
                {item.isSuspicious && (
                  <span title="Flagged by anti-cheat checks"> ⚠️</span>
                )}
              </td>
              <td className="px-3 py-2 text-right text-sm text-gray-500 dark:text-gray-400">
                {new Date(item.submittedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
