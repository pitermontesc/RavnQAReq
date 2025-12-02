import { Page, expect } from "@playwright/test";

export class HomePage {
    constructor(private page: Page) { }

    private jobsLink = 'a[href="/jobs"]';

    async navigate() {
        await this.page.goto('https://www.ravn.co/');
    }

    async goto() {
        await this.page.goto("/");
        await expect(this.page).toHaveURL(/ravn\.co/);
    }

    async clickJobs() {
        await this.page.locator('//a[@href="/jobs/"]').first().click();
        await expect(this.page).toHaveURL(/\/jobs/);
    }

    // async clickJobs() {
    //     await this.page.locator(this.jobsLink).click();
    // }


}
