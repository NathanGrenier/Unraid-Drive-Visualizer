import { ExternalLink, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-unraid-dark py-8 text-sm text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="space-y-1">
          <p>&copy; {new Date().getFullYear()} Unraid Storage Planner.</p>
          <p className="text-xs text-gray-500">
            Disclaimer: This project is not affiliated with, endorsed by, or
            sponsored by Unraid or Lime Technology, Inc.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 md:mt-0">
          <a
            href="https://docs.unraid.net/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-unraid-orange transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Unraid Docs
          </a>
          <a
            href="https://github.com/NathanGrenier/Unraid-Drive-Visualizer"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" /> View Source
          </a>
        </div>
      </div>
    </footer>
  );
}
