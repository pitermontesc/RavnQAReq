import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: './tests',
    timeout: 60_000,
    retries: 0,
    use: {
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
    },
    reporter: [['list'], ['html']]
});
