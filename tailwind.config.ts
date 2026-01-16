import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007c8a",
          50: "#e6f7f8",
          100: "#bce9ed",
          200: "#8ddce3",
          300: "#5dcfd8",
          400: "#2ec3cd",
          500: "#007c8a",
          600: "#006373",
          700: "#004a5e",
          800: "#003249",
          900: "#001934",
        },
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
