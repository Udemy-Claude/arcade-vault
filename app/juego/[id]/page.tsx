import { notFound } from "next/navigation";
import { GameDetail } from "@/components/game-detail";
import { getGame } from "@/lib/games";
import { seededScores } from "@/lib/scores";

export default async function GamePage({ params }: PageProps<"/juego/[id]">) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  return <GameDetail game={game} scores={seededScores(id.length * 17 + 3, 10)} />;
}