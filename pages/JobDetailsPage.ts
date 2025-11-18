import { Page, Locator, expect } from "@playwright/test";

export class JobDetailsPage {
    constructor(private page: Page) { }

    minimumRequirementsSection(): Locator {
        return this.page.locator('//p/strong[contains(text(),"Minimum Requirements")]');
    }

    minimumRequirementsItems(): Locator {
        return this.page.locator('//p/strong[contains(text(),"Minimum Requirements")]/../following-sibling::ul[1]/li');
    }

    async extractMinimumRequirements(): Promise<string[]> {
        //await expect(this.minimumRequirementsSection()).toBeVisible({ timeout: 10000 });;

        const items = this.minimumRequirementsItems();
        const count = await items.count();

        //expect(count).toBeGreaterThan(0);

        const requirements: string[] = [];

        for (let i = 0; i < count; i++) {
            requirements.push((await items.nth(i).innerText()).trim());
        }

        return requirements;
    }
}
