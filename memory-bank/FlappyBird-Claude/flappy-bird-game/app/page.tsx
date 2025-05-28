import GameCanvas from '@/components/game/GameCanvas';

export default function Home() {
  return (
    <main className="w-full h-full flex items-center justify-center">
      <div className="game-container no-select">
        <GameCanvas />
      </div>
    </main>
  );
}
