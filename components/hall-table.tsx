import type { AppUser } from "@/components/app-provider";
import { formatScore, type Game } from "@/lib/games";
import type { Row } from "@/lib/scores";

export function HallTable({
  rows,
  user,
  game,
}: {
  rows: Row[];
  user: AppUser | null;
  game: Game;
}) {
  const youRank = user ? Math.floor(8 + (game.id.length % 4)) : null;
  const youScore = user ? rows[5]?.score - 2400 : null;

  return (
    <div className="hall-table">
      <div className="th">
        <div>RANGO</div>
        <div>JUGADOR</div>
        <div>PUNTUACIÓN</div>
        <div>FECHA</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.name + i}
          className={
            "tr" + (i === 0 ? " top1" : i === 1 ? " top2" : i === 2 ? " top3" : "")
          }
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="rk">#{String(r.rank).padStart(2, "0")}</div>
          <div className="pl">{r.name}</div>
          <div className="sc">{formatScore(r.score)}</div>
          <div className="dt">{r.date}</div>
        </div>
      ))}
      {user && (
        <>
          <div className="tr you-label">▸ TU MEJOR MARCA EN {game.title}</div>
          <div className="tr you" style={{ animationDelay: `${rows.length * 50 + 50}ms` }}>
            <div className="rk" style={{ color: "var(--yellow)" }}>
              #{String(youRank).padStart(2, "0")}
            </div>
            <div className="pl" style={{ color: "var(--yellow)" }}>
              {user.name}
            </div>
            <div
              className="sc"
              style={{
                color: "var(--yellow)",
                textShadow: "0 0 6px rgba(245,255,0,0.5)",
              }}
            >
              {formatScore(youScore || 9999)}
            </div>
            <div className="dt">11/05/2026</div>
          </div>
        </>
      )}
    </div>
  );
}