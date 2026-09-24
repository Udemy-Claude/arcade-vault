import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fade-in">
      <section className="av-hero">
        <h1 className="flicker">404</h1>
        <div className="sub">
          ESTA PANTALLA NO EXISTE EN EL VAULT <span className="blink">_</span>
        </div>
      </section>

      <div
        style={{
          textAlign: "center",
          padding: "0 32px 48px",
        }}
      >
        <div
          className="pixel"
          style={{
            fontSize: 11,
            color: "var(--ink-faint)",
            letterSpacing: "0.16em",
            marginBottom: 28,
          }}
        >
          INSERTA OTRA MONEDA Y VUELVE A EMPEZAR
        </div>
        <Link className="btn lg" href="/">
          VOLVER A LA BIBLIOTECA
        </Link>
      </div>
    </div>
  );
}