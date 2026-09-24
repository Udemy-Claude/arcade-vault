"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useApp } from "@/components/app-provider";
import { HallTable } from "@/components/hall-table";
import { Podium } from "@/components/podium";
import { GAMES } from "@/lib/games";
import { seededScores } from "@/lib/scores";

export function HallOfFame() {
  const { user } = useApp();
  const [tab, setTab] = useState(GAMES[0].id);

  const rows = useMemo(() => seededScores(tab.length * 23 + 7, 12), [tab]);
  const game = GAMES.find((g) => g.id === tab) ?? GAMES[0];

  return (
    <div className="av-hall fade-in">
      <div className="hall-head">
        <h1>SALÓN DE LA FAMA</h1>
        <p className="pixel" style={{ fontSize: 10 }}>
          LOS NOMBRES QUE NUNCA SE BORRAN DE LA PANTALLA
        </p>
      </div>

      <div className="hall-tabs">
        {GAMES.map((g) => (
          <button
            key={g.id}
            className={"chip" + (tab === g.id ? " active" : "")}
            onClick={() => setTab(g.id)}
          >
            {g.title}
          </button>
        ))}
      </div>

      <Podium rows={rows} />

      <HallTable rows={rows} user={user} game={game} />

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link className="btn lg" href="/">
          VOLVER A LA BIBLIOTECA
        </Link>
      </div>
    </div>
  );
}