export function CoverArt({
  cover,
  label,
  className = "cover",
}: {
  cover: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className={"cover-bg " + cover} />
      {label ? <div className="label">{label}</div> : null}
    </div>
  );
}
