import { Page, Locator, expect } from '@playwright/test';

export class JobDetailsPage {
    constructor(private page: Page) { }

    jobTitle(): Locator {
        return this.page.locator('h1, h2').first();
    }

    // Accept common variants 
    private headerCandidates(): Locator {
        const patterns = [
            'Minimum Requirements',
            'Requirements',
            'Qualifications',
            "What you'll need",
            'What you will need',
            'What you bring',
            'You have'
        ];
        const sel = patterns
            .map(p => `h1:has-text("${p}"), h2:has-text("${p}"), h3:has-text("${p}"), h4:has-text("${p}")`)
            .join(', ');
        return this.page.locator(sel);
    }

    private listFollowingHeader(header: Locator): Locator {
        return header.locator('xpath=//following-sibling::*[self::ul or self::ol][1]/li');
    }

    private anyRequirementsListNearHeader(): Locator {
        // Look for the first header that has a list next to it
        const hdr = this.headerCandidates().first();
        return this.listFollowingHeader(hdr);
    }

    async getMinimumRequirements(): Promise<string[]> {
        // Try: list right after a header with requirement-like text
        let items = this.anyRequirementsListNearHeader();
        let count = await items.count();

        // Fallback: some boards have a section wrapper; search any list within a section that contains those keywords
        if (count === 0) {
            const section = this.page.locator(
                'section:has-text("Requirements"), section:has-text("Qualifications"), section:has-text("What you"), div:has(h2:has-text("Requirements")), div:has(h3:has-text("Qualifications"))'
            ).first();
            items = section.locator('ul li, ol li');
            count = await items.count();
        }

        expect(count, 'Expected at least one requirement/qualification bullet').toBeGreaterThan(0);

        const values: string[] = [];
        for (let i = 0; i < count; i++) {
            const text = (await items.nth(i).innerText()).replace(/\s+/g, ' ').trim();
            if (text) values.push(text);
        }
        values.forEach(v => expect.soft(v.length).toBeGreaterThan(0));
        return values;
    }
}
