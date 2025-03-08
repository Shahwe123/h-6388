
// This file extends the Tailwind types with our custom colors

import type { Config } from 'tailwindcss'

declare module 'tailwindcss/types/config' {
  interface ThemeConfig {
    extend?: {
      colors?: {
        primary?: string;
        'neon-purple'?: string;
        'neon-blue'?: string;
        'game-dark'?: string;
        'game-light'?: string;
      };
      gradientColorStops?: {
        'game-dark'?: string;
        'game-light'?: string;
      };
      backgroundImage?: {
        'gradient-game'?: string;
        'grid-pattern'?: string;
      };
    };
  }
}
