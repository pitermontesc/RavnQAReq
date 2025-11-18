import { Page, Locator, expect } from "@playwright/test";

export class JobsPage {
    constructor(private page: Page) { }

    getJobCard(title: string): Locator {
        // Looks inside their job listing container
        return this.page.locator("//button[h4[contains(text(),'" + title + "')]]"); ////button[h4[contains(text(),'QA Automation')]]
    }

    async openJob(title: string) {
        await this.getJobCard(title).click({ timeout: 10000 });
        //await expect(jobCard).toBeVisible({ timeout: 10000 });
        //await jobCard.click();
    }
}
