import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        'primary-hover': '#2563eb',
        secondary: '#f3f4f6',
        border: '#e5e7eb',
        'text-dark': '#1f2937',
        'text-light': '#6b7280',
      },
    },
  },
  plugins: [],
} satisfies Config;