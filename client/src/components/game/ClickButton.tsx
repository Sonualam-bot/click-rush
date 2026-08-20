interface ClickButtonProps {
  onClick: () => void;
}

export function ClickButton({ onClick }: ClickButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 200,
        height: 200,
        borderRadius: "50%",
        fontSize: "1.5rem",
        cursor: "pointer",
      }}
    >
      Click!
    </button>
  );
}
