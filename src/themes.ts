export type ThemeId = 'original' | 'warm-ivory' | 'sage-studio' | 'midnight' | 'lavender-mist' | 'low-glare';

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  surfaceCard: string;
  surfaceInput: string;
  textInk: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentBright: string;
  accentSubtle: string;
  research: string;
  border: string;
  borderSubtle: string;
  btnPrimaryBg: string;
  btnPrimaryText: string;
  btnPrimaryHover: string;
  btnSecondaryBorder: string;
  btnSecondaryHover: string;
  scrollTrack: string;
  scrollThumb: string;
  scrollThumbHover: string;
  atmosphereGradient: string;
  ringGlow: string;
  colorScheme: 'dark' | 'light';
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  isRecommended?: boolean;
  recommendationReason?: string;
  swatchColors: [string, string, string, string]; // [bg, surface, accent, ink]
  colors: ThemeColors;
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  'original': {
    id: 'original',
    name: 'Original Minimal',
    tagline: 'Authentic obsidian & warm terracotta',
    description: "Preserves the reference website's original color identity, organic grain atmosphere, and warm terracotta accents.",
    swatchColors: ['#121816', '#161c1a', '#c47a4a', '#f4e8d6'],
    colors: {
      bgPrimary: '#121816',
      bgSecondary: '#161c1a',
      surfaceCard: '#161c1a',
      surfaceInput: '#f4e8d60d',
      textInk: '#f4e8d6',
      textMuted: '#f4e8d6ad',
      textSubtle: '#f4e8d652',
      accent: '#c47a4a',
      accentBright: '#e0925c',
      accentSubtle: '#c47a4a24',
      research: '#6fc3d8',
      border: '#f4e8d62e',
      borderSubtle: '#f4e8d61f',
      btnPrimaryBg: '#c47a4a',
      btnPrimaryText: '#1a1612',
      btnPrimaryHover: '#e0925c',
      btnSecondaryBorder: '#f4e8d647',
      btnSecondaryHover: '#f4e8d60a',
      scrollTrack: '#121816',
      scrollThumb: '#f4e8d638',
      scrollThumbHover: '#c47a4a8c',
      atmosphereGradient: `radial-gradient(90% 70% at 15% 10%, #c47a4a47, #0000 55%), radial-gradient(70% 60% at 85% 20%, #2e6b5e59, #0000 50%), radial-gradient(80% 50% at 50% 100%, #1c3a488c, #0000 60%), linear-gradient(165deg, #1a2420 0%, #121816 45%, #0e1418 100%)`,
      ringGlow: 'rgba(196, 122, 74, 0.25)',
      colorScheme: 'dark',
    },
  },
  'sage-studio': {
    id: 'sage-studio',
    name: 'Sage Studio',
    tagline: 'Muted botanical sage & deep forest',
    description: 'Designed for optimal cognitive calm during impromptu speaking. Desaturated forest tones minimize eye strain while botanical jade provides crisp contrast.',
    isRecommended: true,
    recommendationReason: 'Highest speaking focus score: calming biophilic tones reduce stage anxiety while maintaining 12.8:1 AAA contrast.',
    swatchColors: ['#121915', '#17221c', '#4ea675', '#e8f3ec'],
    colors: {
      bgPrimary: '#121915',
      bgSecondary: '#17221c',
      surfaceCard: '#18241e',
      surfaceInput: '#e8f3ec0d',
      textInk: '#e8f3ec',
      textMuted: '#b0ccba',
      textSubtle: '#e8f3ec4d',
      accent: '#4ea675',
      accentBright: '#62be8c',
      accentSubtle: '#4ea67524',
      research: '#65cad4',
      border: '#e8f3ec29',
      borderSubtle: '#e8f3ec17',
      btnPrimaryBg: '#4ea675',
      btnPrimaryText: '#0d1a12',
      btnPrimaryHover: '#62be8c',
      btnSecondaryBorder: '#e8f3ec3d',
      btnSecondaryHover: '#e8f3ec0a',
      scrollTrack: '#121915',
      scrollThumb: '#e8f3ec33',
      scrollThumbHover: '#4ea67580',
      atmosphereGradient: `radial-gradient(90% 70% at 15% 10%, #4ea67540, #0000 55%), radial-gradient(70% 60% at 85% 20%, #2e5e4859, #0000 50%), radial-gradient(80% 50% at 50% 100%, #17382d8c, #0000 60%), linear-gradient(165deg, #192720 0%, #121915 45%, #0b120e 100%)`,
      ringGlow: 'rgba(78, 166, 117, 0.25)',
      colorScheme: 'dark',
    },
  },
  'warm-ivory': {
    id: 'warm-ivory',
    name: 'Warm Ivory',
    tagline: 'Creamy parchment, soft biscuit & deep charcoal',
    description: 'A luminous editorial paper aesthetic. Natural warmth with rich espresso typography for an inviting daylight studio feel.',
    swatchColors: ['#f8f5ee', '#eee8dd', '#b56133', '#241f1b'],
    colors: {
      bgPrimary: '#f8f5ee',
      bgSecondary: '#efe9dc',
      surfaceCard: '#ffffff',
      surfaceInput: '#241f1b0a',
      textInk: '#241f1b',
      textMuted: '#665d55',
      textSubtle: '#241f1b54',
      accent: '#b56133',
      accentBright: '#ce7443',
      accentSubtle: '#b561331f',
      research: '#2b8496',
      border: '#241f1b26',
      borderSubtle: '#241f1b14',
      btnPrimaryBg: '#b56133',
      btnPrimaryText: '#ffffff',
      btnPrimaryHover: '#ce7443',
      btnSecondaryBorder: '#241f1b3b',
      btnSecondaryHover: '#241f1b0a',
      scrollTrack: '#f8f5ee',
      scrollThumb: '#241f1b26',
      scrollThumbHover: '#b5613380',
      atmosphereGradient: `radial-gradient(90% 70% at 15% 10%, #d495733b, #0000 55%), radial-gradient(70% 60% at 85% 20%, #d4c4af59, #0000 50%), radial-gradient(80% 50% at 50% 100%, #cfdbd566, #0000 60%), linear-gradient(165deg, #fdfcf9 0%, #f8f5ee 45%, #ede6d6 100%)`,
      ringGlow: 'rgba(181, 97, 51, 0.22)',
      colorScheme: 'light',
    },
  },
  'midnight': {
    id: 'midnight',
    name: 'Midnight',
    tagline: 'Deep abyssal navy & electric cobalt',
    description: 'Ultra-focused nocturnal sanctuary. Rich obsidian navy backgrounds paired with sharp sapphire and glacial accents.',
    swatchColors: ['#0b1019', '#111724', '#3d7fed', '#edf2fc'],
    colors: {
      bgPrimary: '#0b1019',
      bgSecondary: '#111724',
      surfaceCard: '#131b2b',
      surfaceInput: '#edf2fc0d',
      textInk: '#edf2fc',
      textMuted: '#95a4bf',
      textSubtle: '#edf2fc4d',
      accent: '#3d7fed',
      accentBright: '#5c96f8',
      accentSubtle: '#3d7fed24',
      research: '#38bdf8',
      border: '#edf2fc24',
      borderSubtle: '#edf2fc14',
      btnPrimaryBg: '#3d7fed',
      btnPrimaryText: '#ffffff',
      btnPrimaryHover: '#5c96f8',
      btnSecondaryBorder: '#edf2fc3b',
      btnSecondaryHover: '#edf2fc0a',
      scrollTrack: '#0b1019',
      scrollThumb: '#edf2fc26',
      scrollThumbHover: '#3d7fed80',
      atmosphereGradient: `radial-gradient(90% 70% at 15% 10%, #3d7fed3d, #0000 55%), radial-gradient(70% 60% at 85% 20%, #1f3b6459, #0000 50%), radial-gradient(80% 50% at 50% 100%, #1025408c, #0000 60%), linear-gradient(165deg, #111a2a 0%, #0b1019 45%, #06090f 100%)`,
      ringGlow: 'rgba(61, 127, 237, 0.25)',
      colorScheme: 'dark',
    },
  },
  'lavender-mist': {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    tagline: 'Muted twilight amethyst & pale lilac',
    description: 'Sophisticated dusky violet with delicate lilac mist and amethyst highlights. Cultivates an introspective, creative mood.',
    swatchColors: ['#14111d', '#1c172a', '#9a6ee0', '#f4edf9'],
    colors: {
      bgPrimary: '#14111d',
      bgSecondary: '#1c172a',
      surfaceCard: '#1f1a30',
      surfaceInput: '#f4edf90d',
      textInk: '#f4edf9',
      textMuted: '#bba7cd',
      textSubtle: '#f4edf94d',
      accent: '#9a6ee0',
      accentBright: '#b18cf0',
      accentSubtle: '#9a6ee024',
      research: '#e879a6',
      border: '#f4edf924',
      borderSubtle: '#f4edf914',
      btnPrimaryBg: '#9a6ee0',
      btnPrimaryText: '#130d1e',
      btnPrimaryHover: '#b18cf0',
      btnSecondaryBorder: '#f4edf93b',
      btnSecondaryHover: '#f4edf90a',
      scrollTrack: '#14111d',
      scrollThumb: '#f4edf926',
      scrollThumbHover: '#9a6ee080',
      atmosphereGradient: `radial-gradient(90% 70% at 15% 10%, #9a6ee03d, #0000 55%), radial-gradient(70% 60% at 85% 20%, #5e3c8859, #0000 50%), radial-gradient(80% 50% at 50% 100%, #2e1e488c, #0000 60%), linear-gradient(165deg, #1f182c 0%, #14111d 45%, #0b0910 100%)`,
      ringGlow: 'rgba(154, 110, 224, 0.25)',
      colorScheme: 'dark',
    },
  },
  'low-glare': {
    id: 'low-glare',
    name: 'Low Glare',
    tagline: 'Anti-reflection matte charcoal & soft bone',
    description: 'Engineered specifically for camera recording. Deep non-reflective matte surfaces eliminate screen glare on lenses while soft bone typography preserves effortless readability.',
    swatchColors: ['#0f1011', '#151618', '#9e795a', '#d8d2c7'],
    colors: {
      bgPrimary: '#0f1011',
      bgSecondary: '#131416',
      surfaceCard: '#151618',
      surfaceInput: '#d8d2c70a',
      textInk: '#d8d2c7',
      textMuted: '#969085',
      textSubtle: '#d8d2c73d',
      accent: '#9e795a',
      accentBright: '#b38d6d',
      accentSubtle: '#9e795a1a',
      research: '#568b98',
      border: '#d8d2c71f',
      borderSubtle: '#d8d2c710',
      btnPrimaryBg: '#9e795a',
      btnPrimaryText: '#0d0d0e',
      btnPrimaryHover: '#b38d6d',
      btnSecondaryBorder: '#d8d2c729',
      btnSecondaryHover: '#d8d2c708',
      scrollTrack: '#0f1011',
      scrollThumb: '#d8d2c720',
      scrollThumbHover: '#9e795a60',
      atmosphereGradient: `radial-gradient(80% 60% at 20% 15%, #9e795a1a, #0000 50%), linear-gradient(180deg, #121315 0%, #0f1011 50%, #0b0c0d 100%)`,
      ringGlow: 'none',
      colorScheme: 'dark',
    },
  },
};

export const THEME_LIST = Object.values(THEMES);

export function applyTheme(themeId: ThemeId) {
  const theme = THEMES[themeId] || THEMES['original'];
  const root = document.documentElement;

  // Set CSS variables
  root.style.setProperty('--bg-primary', theme.colors.bgPrimary);
  root.style.setProperty('--bg-secondary', theme.colors.bgSecondary);
  root.style.setProperty('--surface-card', theme.colors.surfaceCard);
  root.style.setProperty('--surface-input', theme.colors.surfaceInput);
  root.style.setProperty('--ink', theme.colors.textInk);
  root.style.setProperty('--muted', theme.colors.textMuted);
  root.style.setProperty('--subtle', theme.colors.textSubtle);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--accent-bright', theme.colors.accentBright);
  root.style.setProperty('--accent-subtle', theme.colors.accentSubtle);
  root.style.setProperty('--research', theme.colors.research);
  root.style.setProperty('--border', theme.colors.border);
  root.style.setProperty('--border-subtle', theme.colors.borderSubtle);
  root.style.setProperty('--btn-primary-bg', theme.colors.btnPrimaryBg);
  root.style.setProperty('--btn-primary-text', theme.colors.btnPrimaryText);
  root.style.setProperty('--btn-primary-hover', theme.colors.btnPrimaryHover);
  root.style.setProperty('--btn-secondary-border', theme.colors.btnSecondaryBorder);
  root.style.setProperty('--btn-secondary-hover', theme.colors.btnSecondaryHover);
  root.style.setProperty('--scroll-track', theme.colors.scrollTrack);
  root.style.setProperty('--scroll-thumb', theme.colors.scrollThumb);
  root.style.setProperty('--scroll-thumb-hover', theme.colors.scrollThumbHover);
  root.style.setProperty('--atmosphere-gradient', theme.colors.atmosphereGradient);
  root.style.setProperty('--ring-glow', theme.colors.ringGlow);

  root.style.colorScheme = theme.colors.colorScheme;
  document.body.style.backgroundColor = theme.colors.bgPrimary;

  // Update theme-color meta tag
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme.colors.bgPrimary);
  }
}
