export default function Home() {
  return (
    <div className="av-hero fade-in">
      <h1>Arcade Vault</h1>
      <p className="sub">
        La bóveda de los arcade <span className="blink">▮</span>
      </p>
      <p
        className="mono"
        style={{
          marginTop: 26,
          color: "var(--ink-dim)",
          fontSize: 13,
          letterSpacing: "0.08em",
        }}
      >
        Biblioteca de juegos, récords y competición. Próximamente.
      </p>
    </div>
  );
}
