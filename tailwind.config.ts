import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['var(--font-bebas)'],
        montserrat: ['var(--font-montserrat)'],
        inter: ['var(--font-inter)'],
      },
      colors: {
        navy: '#0C1B2E',
        forest: {
          darkest: '#0f1e0a',
          dark: '#172c10',
          mid: '#1e3414',
          light: '#243a1c',
          bright: '#2c4820',
        },
      },
    },
  },
  plugins: [],
}

export default config
