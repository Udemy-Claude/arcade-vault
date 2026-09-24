"use client";

import Link from "next/link";
import { useRef } from "react";
import { CoverArt } from "@/components/cover-art";
import { formatScore, type Game } from "@/lib/games";

export function GameCard({ game }: { game: Game }) {
  const tiltRef = useRef<HTMLAnchorElement>(null);

  const accent =
    game.color === "magenta" ? " magenta" : game.color === "yellow" ? " yellow" : "";

  return (
    <Link
      ref={tiltRef}
      className="card"
      href={`/juego/${game.id}`}
      onMouseMove={(e) => {
        const el = tiltRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `translateY(-6px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg)`;
      }}
      onMouseLeave={() => {
        const el = tiltRef.current;
        if (!el) return;
        el.style.transform = "";
      }}
    >
      <CoverArt cover={game.cover} label={game.cat} />
      <div className="meta">
        <div className="title">{game.title}</div>
        <div className="desc">{game.short}</div>
        <div className="row">
          <div className="score-badge">
            <span>MEJOR PUNTUACIÓN</span>
            <b>{formatScore(game.best)}</b>
          </div>
          <span className={"btn" + accent}>JUGAR</span>
        </div>
      </div>
    </Link>
  );
}