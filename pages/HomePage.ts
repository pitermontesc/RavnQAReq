import { Page, expect } from '@playwright/test';

export class HomePage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });
        // Accept cookie/consent dialogs if present (best-effort).
        const consentButtons = this.page.locator(
            'button:has-text("Accept"), button:has-text("I agree"), button[aria-label*="accept" i]'
        );
        try {
            if (await consentButtons.first().isVisible({ timeout: 2000 })) {
                await consentButtons.first().click({ trial: false });
            }
        } catch { /* ignore if not present */ }

        await expect(this.page).toHaveURL(/ravn\.co/i);
        await expect(this.page).toHaveTitle(/ravn/i);
        // Basic sanity: a visible header or nav exists
        const headerOrNav = this.page.locator('header, nav').first();
        await expect(headerOrNav).toBeVisible();
    }

    async openJobs() {
        // On some layouts it's "Jobs", others "Careers" (sometimes in the header or footer)
        const candidates = [
            this.page.getByRole('link', { name: /^jobs$/i }),
            this.page.getByRole('link', { name: /careers/i }),
            this.page.locator('a[href*="jobs"], a[href*="careers"]').first(),
        ];

        let clicked = false;
        for (const loc of candidates) {
            try {
                if (await loc.isVisible({ timeout: 1500 })) {
                    await loc.click();
                    clicked = true;
                    break;
                }
            } catch { /* try next */ }
        }

        // If in mobile layout, the menu may be behind a hamburger button
        if (!clicked) {
            const menuBtn = this.page.getByRole('button', { name: /menu|open|navigation/i });
            try {
                if (await menuBtn.isVisible({ timeout: 1500 })) {
                    await menuBtn.click();
                    const jobsLink = this.page.getByRole('link', { name: /(jobs|careers)/i }).first();
                    await jobsLink.click();
                    clicked = true;
                }
            } catch { /* fall through */ }
        }

        expect(clicked).toBeTruthy();

        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL(/jobs|careers/i);
    }
}
