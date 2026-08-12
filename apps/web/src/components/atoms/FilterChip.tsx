interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  isActive?: boolean;
}

export default function FilterChip({ label, onRemove, isActive }: FilterChipProps) {
  if (isActive || onRemove) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-text-muted/30 px-3 py-1.5 text-sm font-medium text-text-primary">
        {label}
        {onRemove && (
          <button
            onClick={onRemove}
            className="hover:text-red-400 transition-colors cursor-pointer"
            aria-label="Remover filtro"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center rounded-full bg-card-border px-3 py-1.5 text-sm font-medium text-text-secondary">
      {label}
    </div>
  );
}
