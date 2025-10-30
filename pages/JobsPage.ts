import { Page, Locator, expect } from '@playwright/test';

export class JobsPage {
    constructor(private page: Page) { }

    jobCardByTitleRegex(title: RegExp): Locator {
        const link = this.page.getByRole('link', { name: title });
        const heading = this.page.locator('h1,h2,h3,h4').filter({ hasText: title });
        return link.or(heading).or(this.page.locator('a, article, div').filter({ hasText: title })).first();
    }

    async assertJobsListVisible() {
        const possibleJobs = this.page.locator(
            'a:has-text("Engineer"), a:has-text("Developer"), a:has-text("QA"), [href*="job"], [href*="position"]'
        );
        const count = await possibleJobs.count();
        expect(count).toBeGreaterThan(0);
    }

    async openJobByTitle(titleRegex: RegExp) {
        const card = this.jobCardByTitleRegex(titleRegex);
        await expect(card, `Job card matching ${titleRegex} should be visible`).toBeVisible();

        // If there’s a link inside, remove target=_blank so it opens in the same tab.
        const innerLink = card.locator('a').first();
        if (await innerLink.isVisible().catch(() => false)) {
            try {
                await innerLink.evaluate((a: HTMLAnchorElement) => a.removeAttribute('target'));
            } catch { /* ignore if not an anchor or cross-origin blocks */ }
            await innerLink.click();
        } else {
            // If the card itself is a link, try to remove target there too
            try {
                await card.evaluate((el: Element) => {
                    if ((el as HTMLAnchorElement).removeAttribute) {
                        (el as HTMLAnchorElement).removeAttribute('target');
                    }
                });
            } catch { /* ignore */ }
            await card.click();
        }

        await this.page.waitForLoadState('domcontentloaded');
    }

    /** Allow tests to grab the active page after possible popup */
    getActivePage(): Page {
        return this.page;
    }
}
