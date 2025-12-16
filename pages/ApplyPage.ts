import { Page, Locator, expect } from '@playwright/test';
import path from 'path';

export class ApplyPage {
    private page: Page;

    // Declare first (no this.page usage here)
    private firstName!: Locator;
    private lastName!: Locator;
    private email!: Locator;
    private phone!: Locator;

    private country!: Locator;
    private city!: Locator;
    private yearsExp!: Locator;

    private resumeInput!: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators AFTER page is assigned
        this.firstName = this.page.locator('//input[@name="firstName"]');
        this.lastName = this.page.locator('//input[@name="lastName"]');
        this.email = this.page.locator('//input[@name="email"]');
        this.phone = this.page.locator('//input[@name="phone"]');

        this.country = this.page.getByLabel('Country', { exact: false });
        this.city = this.page.locator('//input[@name="city"]');
        this.yearsExp = this.page.getByLabel('Years of experience', { exact: false });

        this.resumeInput = this.page.locator('input[type="file"]').first();
    }
    async waitForForm() {
        await expect(this.firstName).toBeVisible({ timeout: 15000 });
    }

    async fillRequiredFields(data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        country: string;
        city: string;
        yearsOfExperience: string;
        resumeRelativePath?: string;
    }) {
        await this.waitForForm();

        await this.firstName.fill(data.firstName);
        await this.lastName.fill(data.lastName);
        await this.email.fill(data.email);
        await this.phone.fill(data.phone);

        const tag = await this.country.evaluate(el => el.tagName.toLowerCase()).catch(() => '');
        if (tag === 'select') {
            await this.country.selectOption({ label: data.country });
        } else {
            await this.country.click();
            await this.page.getByRole('option', { name: new RegExp(data.country, 'i') }).click();
        }

        await this.city.fill(data.city);

        // Years dropdown: same approach
        const yearsTag = await this.yearsExp.evaluate(el => el.tagName.toLowerCase()).catch(() => '');
        if (yearsTag === 'select') {
            await this.yearsExp.selectOption({ label: data.yearsOfExperience });
        } else {
            await this.yearsExp.click();
            await this.page.getByRole('option', { name: new RegExp(data.yearsOfExperience, 'i') }).click();
        }

        // Upload resume
        const resumePath = data.resumeRelativePath
            ? path.resolve(data.resumeRelativePath)
            : path.resolve('tests/resources/resume.txt');

        await this.resumeInput.setInputFiles(resumePath);
    }

    async assertRequiredFieldsFilled(data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        country: string;
        city: string;
        yearsOfExperience: string;
    }) {
        await expect(this.firstName).toHaveValue(data.firstName);
        await expect(this.lastName).toHaveValue(data.lastName);
        await expect(this.email).toHaveValue(data.email);
        await expect(this.phone).toHaveValue(data.phone);

        const countryTag = await this.country.evaluate(el => el.tagName.toLowerCase()).catch(() => ''); //empty
        if (countryTag === 'select') {
            await expect(this.country).toHaveValue(/.+/); // has some value
        } else {
            await expect(this.country).toContainText(new RegExp(data.country, 'i'));
        }

        await expect(this.city).toHaveValue(data.city);

        // const yearsTag = await this.yearsExp.evaluate(el => el.tagName.toLowerCase()).catch(() => '');
        // if (yearsTag === 'select') {
        //     await expect(this.yearsExp).toHaveValue(/.+/);
        // } else {
        //     await expect(this.yearsExp).toContainText(new RegExp(data.yearsOfExperience, 'i'));
        // }

        // // Assert resume uploaded (input has files)
        // await expect(this.resumeInput).toHaveJSProperty('files', expect.anything());
        const fileCount = await this.resumeInput.evaluate((el: HTMLInputElement) => el.files?.length ?? 0);
        expect(fileCount).toBeGreaterThan(0);
    }
}
