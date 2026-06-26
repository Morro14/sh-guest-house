import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import path from "path";
import fs from "fs";

// https://vite.dev/config/
function objDeepMerge(target, source) {
  const isObject = (item) => typeof item === "object" && !Array.isArray(item);
  if (isObject(target)) {
    for (const key in source) {
      if (target[key] && isObject(source[key])) {
        objDeepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
}
export default defineConfig({
  // base: "/static/frontend/",
  server: {
    watch: {
      ignored: [
        // "**/src/data/map-labels-data.json",
        // "**/src/data/town-labels.json",
      ],
    },
    port: 5173,
    host: "frontend.test",
    strictPort: true,
    allowedHosts: ["frontend.test"],
    // proxy: {
    //   "/api": {
    //     target: "http://backend.test:8000",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    //   "/media": {
    //     target: "http://backend.test:8000",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  plugins: [
    reactRouter(),
    tailwindcss(),
    {
      name: "map-saver",
      configureServer(server) {
        server.middlewares.use(
          "/api/save-map-labels-data",
          (req, res, next) => {
            if (req.method === "POST") {
              let body = "";

              req.on("data", (chunk) => {
                body += chunk.toString();
              });

              req.on("end", () => {
                try {
                  const payload = JSON.parse(body);
                  const payloadType = payload.type;
                  const paths = {
                    townLabel: "src/data/town-labels.json",
                    placeLabel: "src/data/map-labels-data.json",
                    placeDot: "src/data/place-dots-data.json",
                  };
                  const filePath = path.resolve(__dirname, paths[payloadType]);
                  let existingData = [];
                  if (fs.existsSync(filePath)) {
                    const fileContent = fs.readFileSync(filePath, "utf-8");
                    existingData = JSON.parse(fileContent || "[]");
                  }
                  const newData = Array.isArray(payload) ? payload : [payload];

                  newData.forEach((newItem) => {
                    const index = existingData.findIndex(
                      (item) => item.name === newItem.name,
                    );
                    if (index > -1) {
                      existingData[index] = objDeepMerge(
                        existingData[index],
                        newItem,
                      );
                    } else {
                      existingData.push(newItem);
                    }
                  });

                  fs.writeFileSync(
                    filePath,
                    JSON.stringify(existingData, null, 4),
                  );

                  res.statusCode = 200;
                  res.end("Updated successfully");
                } catch (err) {
                  res.statusCode = 500;
                  res.end("JSON Parse Error");
                }
              });
            } else {
              next();
            }
          },
        );
      },
    },
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    sourcemap: true,
  },
});
