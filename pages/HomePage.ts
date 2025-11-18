import { Page, expect } from "@playwright/test";

export class HomePage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto("/");
        await expect(this.page).toHaveURL(/ravn\.co/);
    }

    async clickJobs() {
        await this.page.getByRole("link", { name: "Jobs" }).first().click();
        await expect(this.page).toHaveURL(/\/jobs/);
    }
}
