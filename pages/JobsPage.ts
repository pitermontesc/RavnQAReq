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


    private jobLink = (title: string) =>
        this.page.locator("//button[h4[contains(text(),'" + title + "')]]");

    async openJobByTitle(title: string, context: BrowserContext): Promise<Page> {
        const link = this.jobLink(title).first();
        await expect(link).toBeVisible({ timeout: 15000 });

        const [maybeNewPage] = await Promise.all([
            context.waitForEvent('page').catch(() => null),
            link.click({ force: true }),
        ]);

        const target = maybeNewPage ?? this.page;
        await target.waitForLoadState('domcontentloaded');
        return target;
    }
}
