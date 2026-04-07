import React from 'react';

interface SocialMediaProps {
  isDarkMode: boolean
}

const SocialMedia: React.FC<SocialMediaProps> = ({ isDarkMode }) => {
  return (
    <div className="socialmedia">
          <div className="flex flex-wrap gap-3 text-sm font-mono">
            <a
              href="https://github.com/maeskidev"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors ${
                isDarkMode
                  ? "border-white/20 bg-white/5 hover:bg-white/10"
                  : "border-black/20 bg-black/5 hover:bg-black/10"
              }`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 0 0 8.2 11.4c.6.1.8-.26.8-.58v-2.25c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.2.08 1.84 1.24 1.84 1.24 1.08 1.85 2.83 1.32 3.52 1 .1-.79.42-1.32.77-1.63-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.28-1.55 3.28-1.23 3.28-1.23.67 1.65.25 2.88.13 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.64-5.48 5.94.43.38.82 1.12.82 2.27v3.36c0 .32.2.69.82.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/michaelquiros/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors ${
                isDarkMode
                  ? "border-white/20 bg-white/5 hover:bg-white/10"
                  : "border-black/20 bg-black/5 hover:bg-black/10"
              }`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05c.53-1 1.82-2.06 3.75-2.06C21.54 8.58 23 11.04 23 14.6V21h-4v-5.67c0-1.35-.02-3.08-1.88-3.08-1.88 0-2.16 1.47-2.16 2.98V21h-4V9Z" />
              </svg>
              <span>LinkedIn</span>
            </a>
            {/* <a href="https://hojitadevida.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">hojitadevida</a> */}
          </div>
        </div>
  );
};

export default SocialMedia;
