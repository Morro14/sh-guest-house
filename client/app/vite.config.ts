import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
// import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/static/frontend/",
  plugins: [reactRouter(), tailwindcss()],
  // base: "./",
  // resolve: {
  //   alias: {
  //     "~": path.resolve(__dirname, "app"),
  //     root: path.resolve(__dirname),
  //   },
  // },
  build: {
    sourcemap: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
});
