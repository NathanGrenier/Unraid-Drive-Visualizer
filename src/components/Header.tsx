import { Server } from "lucide-react";

export function Header() {
  return (
    <header className="bg-unraid-dark border-b border-white/10 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-unraid-orange p-2 rounded-lg">
            <Server className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Unraid Storage Planner
          </h1>
        </div>
        <a
          href="https://unraid.net"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-gray-400 hover:text-unraid-orange transition-colors"
        >
          unraid.net
        </a>
      </div>
    </header>
  );
}
