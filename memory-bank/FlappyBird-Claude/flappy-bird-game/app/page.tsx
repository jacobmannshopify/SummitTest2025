import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full h-full flex items-center justify-center">
      <div className="game-container no-select">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl mb-8 text-white">Flappy Bird</h1>
            <p className="text-xs text-white/80">Claude Version</p>
            <p className="text-xs mt-8 text-white/60">Click to Start</p>
          </div>
        </div>
      </div>
    </main>
  );
}
