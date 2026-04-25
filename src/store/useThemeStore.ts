// ============================================================
// Vex — Cross the line.
// useThemeStore — Global site-wide theme cycling with persistence
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SiteTheme {
  id: string;
  name: string;
  icon: string;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgSurface: string;
    bgSurfaceHover: string;
    bgElevated: string;
    border: string;
    borderHover: string;
    borderFocus: string;
    accentGreen: string;
    accentGreenDim: string;
    accentCyan: string;
    accentCyanDim: string;
    accentRed: string;
    accentRedDim: string;
    accentOrange: string;
    accentOrangeDim: string;
    accentPurple: string;
    accentPurpleDim: string;
    accentYellow: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textAccent: string;
  };
}

export const SITE_THEMES: SiteTheme[] = [
  {
    id: 'cyberpunk', name: 'Cyberpunk', icon: '💚',
    colors: {
      bgPrimary: '#050505', bgSecondary: '#0a0a0a', bgSurface: '#111111',
      bgSurfaceHover: '#161616', bgElevated: '#1a1a1a',
      border: '#1e1e1e', borderHover: '#2a2a2a', borderFocus: '#00ff88',
      accentGreen: '#00ff88', accentGreenDim: '#00cc6a',
      accentCyan: '#00d4ff', accentCyanDim: '#00a8cc',
      accentRed: '#ff3366', accentRedDim: '#cc2952',
      accentOrange: '#ff8800', accentOrangeDim: '#cc6d00',
      accentPurple: '#a855f7', accentPurpleDim: '#8b44cc',
      accentYellow: '#eab308',
      textPrimary: '#e8e8e8', textSecondary: '#888888', textMuted: '#555555', textAccent: '#00ff88',
    },
  },
  {
    id: 'dracula', name: 'Dracula', icon: '🧛',
    colors: {
      bgPrimary: '#1e1f29', bgSecondary: '#282a36', bgSurface: '#2d2f3d',
      bgSurfaceHover: '#343746', bgElevated: '#383a4a',
      border: '#44475a', borderHover: '#555870', borderFocus: '#bd93f9',
      accentGreen: '#50fa7b', accentGreenDim: '#3dd667',
      accentCyan: '#8be9fd', accentCyanDim: '#6dd0e7',
      accentRed: '#ff5555', accentRedDim: '#e04040',
      accentOrange: '#ffb86c', accentOrangeDim: '#e6a050',
      accentPurple: '#bd93f9', accentPurpleDim: '#a87de0',
      accentYellow: '#f1fa8c',
      textPrimary: '#f8f8f2', textSecondary: '#9999aa', textMuted: '#6272a4', textAccent: '#bd93f9',
    },
  },
  {
    id: 'nord', name: 'Nord', icon: '❄️',
    colors: {
      bgPrimary: '#242933', bgSecondary: '#2e3440', bgSurface: '#353c4a',
      bgSurfaceHover: '#3b4252', bgElevated: '#434c5e',
      border: '#3b4252', borderHover: '#4c566a', borderFocus: '#88c0d0',
      accentGreen: '#a3be8c', accentGreenDim: '#8faa78',
      accentCyan: '#88c0d0', accentCyanDim: '#70a8b8',
      accentRed: '#bf616a', accentRedDim: '#a84e57',
      accentOrange: '#d08770', accentOrangeDim: '#b8705a',
      accentPurple: '#b48ead', accentPurpleDim: '#9c7898',
      accentYellow: '#ebcb8b',
      textPrimary: '#eceff4', textSecondary: '#a0aec0', textMuted: '#616e83', textAccent: '#88c0d0',
    },
  },
  {
    id: 'monokai', name: 'Monokai', icon: '🔥',
    colors: {
      bgPrimary: '#1c1e1a', bgSecondary: '#272822', bgSurface: '#2d2e27',
      bgSurfaceHover: '#383930', bgElevated: '#3e3d32',
      border: '#3e3d32', borderHover: '#525043', borderFocus: '#a6e22e',
      accentGreen: '#a6e22e', accentGreenDim: '#8ec420',
      accentCyan: '#66d9ef', accentCyanDim: '#50c0d8',
      accentRed: '#f92672', accentRedDim: '#e0155e',
      accentOrange: '#fd971f', accentOrangeDim: '#e08010',
      accentPurple: '#ae81ff', accentPurpleDim: '#9a6be6',
      accentYellow: '#e6db74',
      textPrimary: '#f8f8f2', textSecondary: '#a6a68a', textMuted: '#75715e', textAccent: '#a6e22e',
    },
  },
  {
    id: 'matrix', name: 'Matrix', icon: '🟢',
    colors: {
      bgPrimary: '#000600', bgSecondary: '#000a00', bgSurface: '#001200',
      bgSurfaceHover: '#001a00', bgElevated: '#002000',
      border: '#003300', borderHover: '#004d00', borderFocus: '#00ff41',
      accentGreen: '#00ff41', accentGreenDim: '#00cc34',
      accentCyan: '#00e5ff', accentCyanDim: '#00b8cc',
      accentRed: '#ff1a1a', accentRedDim: '#cc1414',
      accentOrange: '#ff8c00', accentOrangeDim: '#cc7000',
      accentPurple: '#66ff66', accentPurpleDim: '#44dd44',
      accentYellow: '#99ff33',
      textPrimary: '#00ff41', textSecondary: '#00bb30', textMuted: '#006620', textAccent: '#00ff41',
    },
  },
  {
    id: 'midnight', name: 'Midnight', icon: '🌙',
    colors: {
      bgPrimary: '#0d1117', bgSecondary: '#161b22', bgSurface: '#1c2129',
      bgSurfaceHover: '#21262d', bgElevated: '#272d36',
      border: '#30363d', borderHover: '#3d444d', borderFocus: '#58a6ff',
      accentGreen: '#3fb950', accentGreenDim: '#2ea043',
      accentCyan: '#58a6ff', accentCyanDim: '#4090e0',
      accentRed: '#f85149', accentRedDim: '#da3633',
      accentOrange: '#d29922', accentOrangeDim: '#b88218',
      accentPurple: '#bc8cff', accentPurpleDim: '#a371e6',
      accentYellow: '#e3b341',
      textPrimary: '#e6edf3', textSecondary: '#8b949e', textMuted: '#484f58', textAccent: '#58a6ff',
    },
  },
  {
    id: 'solarized', name: 'Solarized', icon: '☀️',
    colors: {
      bgPrimary: '#001e26', bgSecondary: '#002b36', bgSurface: '#073642',
      bgSurfaceHover: '#0a3f4e', bgElevated: '#0d4858',
      border: '#0d4858', borderHover: '#1a6070', borderFocus: '#b58900',
      accentGreen: '#859900', accentGreenDim: '#6d8000',
      accentCyan: '#2aa198', accentCyanDim: '#228880',
      accentRed: '#dc322f', accentRedDim: '#c02825',
      accentOrange: '#cb4b16', accentOrangeDim: '#b03e10',
      accentPurple: '#6c71c4', accentPurpleDim: '#575caa',
      accentYellow: '#b58900',
      textPrimary: '#fdf6e3', textSecondary: '#93a1a1', textMuted: '#586e75', textAccent: '#b58900',
    },
  },
  {
    id: 'bloodmoon', name: 'Blood Moon', icon: '🩸',
    colors: {
      bgPrimary: '#0a0000', bgSecondary: '#120000', bgSurface: '#1a0505',
      bgSurfaceHover: '#200808', bgElevated: '#280a0a',
      border: '#3d1515', borderHover: '#551e1e', borderFocus: '#ff4444',
      accentGreen: '#ff4444', accentGreenDim: '#cc3535',
      accentCyan: '#ff6b6b', accentCyanDim: '#e05555',
      accentRed: '#ff2222', accentRedDim: '#cc1a1a',
      accentOrange: '#ff8855', accentOrangeDim: '#e07040',
      accentPurple: '#ff5599', accentPurpleDim: '#e04080',
      accentYellow: '#ffaa44',
      textPrimary: '#ffcccc', textSecondary: '#aa6666', textMuted: '#663333', textAccent: '#ff4444',
    },
  },
  {
    id: 'ocean', name: 'Ocean Deep', icon: '🌊',
    colors: {
      bgPrimary: '#020c18', bgSecondary: '#051525', bgSurface: '#0a1e30',
      bgSurfaceHover: '#0e2840', bgElevated: '#12304a',
      border: '#1a3d5c', borderHover: '#255580', borderFocus: '#00bfff',
      accentGreen: '#00e5a0', accentGreenDim: '#00c080',
      accentCyan: '#00bfff', accentCyanDim: '#009dd4',
      accentRed: '#ff6090', accentRedDim: '#dd4070',
      accentOrange: '#ffa040', accentOrangeDim: '#dd8030',
      accentPurple: '#80a0ff', accentPurpleDim: '#6080dd',
      accentYellow: '#ffe066',
      textPrimary: '#d0e8ff', textSecondary: '#7090b0', textMuted: '#405060', textAccent: '#00bfff',
    },
  },
  {
    id: 'amber', name: 'Amber Glow', icon: '🔶',
    colors: {
      bgPrimary: '#0c0800', bgSecondary: '#141000', bgSurface: '#1c1808',
      bgSurfaceHover: '#242010', bgElevated: '#2c2818',
      border: '#3d3520', borderHover: '#554a30', borderFocus: '#ffaa00',
      accentGreen: '#ffaa00', accentGreenDim: '#dd9000',
      accentCyan: '#ffc844', accentCyanDim: '#dda830',
      accentRed: '#ff5533', accentRedDim: '#dd3818',
      accentOrange: '#ff8800', accentOrangeDim: '#dd7000',
      accentPurple: '#ffcc66', accentPurpleDim: '#ddaa44',
      accentYellow: '#ffdd00',
      textPrimary: '#ffe8c0', textSecondary: '#aa8855', textMuted: '#665530', textAccent: '#ffaa00',
    },
  },
  {
    id: 'synthwave', name: 'Synthwave', icon: '🎵',
    colors: {
      bgPrimary: '#0a0014', bgSecondary: '#120020', bgSurface: '#1a0830',
      bgSurfaceHover: '#221040', bgElevated: '#2a1850',
      border: '#3a2060', borderHover: '#503080', borderFocus: '#ff00ff',
      accentGreen: '#ff00ff', accentGreenDim: '#cc00cc',
      accentCyan: '#00ffff', accentCyanDim: '#00cccc',
      accentRed: '#ff3388', accentRedDim: '#dd1868',
      accentOrange: '#ff6600', accentOrangeDim: '#dd5000',
      accentPurple: '#cc44ff', accentPurpleDim: '#aa30dd',
      accentYellow: '#ffff00',
      textPrimary: '#f0d0ff', textSecondary: '#9966bb', textMuted: '#553377', textAccent: '#ff00ff',
    },
  },
  {
    id: 'arctic', name: 'Arctic', icon: '🧊',
    colors: {
      bgPrimary: '#050a10', bgSecondary: '#0a1018', bgSurface: '#101820',
      bgSurfaceHover: '#152028', bgElevated: '#1a2830',
      border: '#203040', borderHover: '#304050', borderFocus: '#66ddff',
      accentGreen: '#66ffcc', accentGreenDim: '#44ddaa',
      accentCyan: '#66ddff', accentCyanDim: '#44bbdd',
      accentRed: '#ff6688', accentRedDim: '#dd4466',
      accentOrange: '#ffaa66', accentOrangeDim: '#dd8844',
      accentPurple: '#aabbff', accentPurpleDim: '#8899dd',
      accentYellow: '#eeff88',
      textPrimary: '#e0f0ff', textSecondary: '#80a0c0', textMuted: '#405060', textAccent: '#66ddff',
    },
  },
];

interface ThemeState {
  currentIndex: number;
  theme: SiteTheme;
  cycleTheme: () => void;
  setTheme: (id: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentIndex: 0,
      theme: SITE_THEMES[0],
      cycleTheme: () =>
        set((state) => {
          const next = (state.currentIndex + 1) % SITE_THEMES.length;
          return { currentIndex: next, theme: SITE_THEMES[next] };
        }),
      setTheme: (id: string) =>
        set(() => {
          const idx = SITE_THEMES.findIndex((t) => t.id === id);
          if (idx === -1) return {};
          return { currentIndex: idx, theme: SITE_THEMES[idx] };
        }),
    }),
    {
      name: 'vex-theme',
      partialize: (state) => ({
        currentIndex: state.currentIndex,
        theme: state.theme,
      }),
    }
  )
);
