import type { HistoryItem } from "../../api/user.api";

interface HistoryTableProps {
  items: HistoryItem[];
}

export function HistoryTable({ items }: HistoryTableProps) {
  if (items.length === 0) {
    return <p>No games played yet.</p>;
  }

  return (
    <table style={{ margin: "1rem auto", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ padding: "0.5rem" }}>Mode</th>
          <th style={{ padding: "0.5rem" }}>Score</th>
          <th style={{ padding: "0.5rem" }}>Date</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td style={{ padding: "0.5rem" }}>{item.mode}</td>
            <td style={{ padding: "0.5rem", textAlign: "center" }}>
              {item.score}
              {item.isSuspicious && " ⚠"}
            </td>
            <td style={{ padding: "0.5rem" }}>
              {new Date(item.submittedAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
