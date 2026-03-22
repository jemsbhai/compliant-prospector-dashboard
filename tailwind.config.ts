import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        compliant: {
          50: "#ecfdf5",
          500: "#10b981",
          700: "#047857",
        },
        violation: {
          50: "#fef2f2",
          500: "#ef4444",
          700: "#b91c1c",
        },
        uncertainty: {
          50: "#fffbeb",
          500: "#f59e0b",
          700: "#b45309",
        },
        review: {
          50: "#fff7ed",
          500: "#f97316",
          700: "#c2410c",
        },
      },
    },
  },
  plugins: [],
};
export default config;
