import { defineConfig, UserConfig } from "vite";
import { mite } from "mite/vite";

export default defineConfig({
    plugins: [mite()],
    build: {
        target: "esnext",
        minify: false
    }
});
