import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1d2a2f",
        muted: "#5f6c71",
        brand: "#e78e4f",
        brandDeep: "#c76436",
        sage: "#88b8a5",
      },
      boxShadow: {
        soft: "0 24px 60px rgba(76, 53, 35, 0.12)",
        warm: "0 30px 70px rgba(71, 46, 29, 0.16)",
      },
      fontFamily: {
        sans: [
          "Trebuchet MS",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
