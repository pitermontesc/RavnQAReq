import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    use: {
        baseURL: "https://www.ravn.co/",
        headless: true,
    },
});
