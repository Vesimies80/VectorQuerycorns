const config = {
  plugins: ["@tailwindcss/postcss"],
  tailwindcss: {
    config: "./tailwind.config.js",
  },
  autoprefixer: {},
  // This is needed for Next.js to handle CSS imports correctly
};

export default config;
