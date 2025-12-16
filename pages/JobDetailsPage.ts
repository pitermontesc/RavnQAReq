import { Page, Locator, expect } from "@playwright/test";

export class JobDetailsPage {
    constructor(private page: Page) { }

    minimumRequirementsSection(): Locator {
        return this.page.locator('//p/strong[contains(text(),"Minimum Requirements")]');
    }
    reqList(): Locator {
        return this.page.locator("(//p)[14]//following-sibling::ul[1]/li");
    }
    minimumRequirementsItems(): Locator {
        return this.page.locator('//p/strong[contains(text(),"Minimum Requirements")]/../following-sibling::ul[1]/li');
    }

    applyButton(): Locator {
        return this.page.locator('//button[contains(text(),"Apply to this job")]').first();
    }

    async scrollToBottom() {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    async clickApply(): Promise<void> {
        await expect(this.applyButton()).toBeVisible({ timeout: 15000 });
        await this.applyButton().click();
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
    async getSectionItemsByHeader(headerText: string): Promise<string[]> {
        return this.page.evaluate((headerText) => {
            const regex = new RegExp(headerText, 'i');
            const headers = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
            const header = headers.find((h) => regex.test(h.textContent || ''));
            if (!header) return [];
            const items: string[] = [];
            let el = header.nextElementSibling;
            while (el) {
                if (/^H[1-6]$/.test(el.tagName)) break;
                el.querySelectorAll('li').forEach((li) => {
                    const text = li.textContent?.trim();
                    if (text) items.push(text);
                });
                el = el.nextElementSibling;
            }
            return items;
        }, headerText);
    }
    async getMinimumRequirements(): Promise<string[]> {
        for (const label of ['Minimum Requirements', 'Requirements', 'Qualifications']) {
            const items = await this.getSectionItemsByHeader(label);
            if (items.length) return items;
        }
        return [];
    }

    // async minReqPrint() {
    //     const count = await this.reqList.count();
    //     console.log(`Minimun requirementes amount: ${count}`);
    //     const texts = await this.reqList.allInnerTexts();
    //     for (const [index, text] of texts.entries()) {
    //         console.log(`Minimun requirements: ${index + 1}: ${text}`);
    //     }
    // }
}
