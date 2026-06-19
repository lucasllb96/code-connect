interface DividerProps {
  text: string;
}

export default function Divider({ text }: DividerProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-divider" />
      <span className="text-xs text-text-muted whitespace-nowrap">{text}</span>
      <span className="h-px flex-1 bg-divider" />
    </div>
  );
}
