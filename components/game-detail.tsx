import Link from "next/link";
import { CoverArt } from "@/components/cover-art";
import { Leaderboard } from "@/components/leaderboard";
import { formatScore, type Game } from "@/lib/games";
import type { Row } from "@/lib/scores";

export function GameDetail({ game, scores }: { game: Game; scores: Row[] }) {
  return (
    <div className="av-detail fade-in">
      <div>
        <CoverArt cover={game.cover} className="detail-cover" />
        <div style={{ marginTop: 20 }} className="detail-info">
          <div className="detail-tags">
            <span>{game.cat}</span>
            <span>1 JUGADOR</span>
            <span>TECLADO / TÁCTIL</span>
            <span>RETRO 1985</span>
          </div>
          <h2 className="neon-cyan">{game.title}</h2>
          <p>{game.long}</p>
          <div className="stat-strip">
            <div>
              <div className="l">Partidas</div>
              <div className="v">{game.plays}</div>
            </div>
            <div>
              <div className="l">Mejor global</div>
              <div
                className="v"
                style={{
                  color: "var(--magenta)",
                  textShadow: "0 0 6px rgba(255,0,110,0.5)",
                }}
              >
                {formatScore(game.best)}
              </div>
            </div>
            <div>
              <div className="l">Dificultad</div>
              <div
                className="v"
                style={{
                  color: "var(--yellow)",
                  textShadow: "0 0 6px rgba(245,255,0,0.5)",
                }}
              >
                ★ ★ ★ ☆ ☆
              </div>
            </div>
          </div>
          <div className="detail-actions">
            <Link className="btn xl pulse" href={`/jugar/${game.id}`}>
              ▶  JUGAR AHORA
            </Link>
            <Link className="btn ghost lg" href="/">
              VOLVER AL VAULT
            </Link>
          </div>
        </div>
      </div>

      <aside>
        <Leaderboard scores={scores} />
      </aside>
    </div>
  );
}
