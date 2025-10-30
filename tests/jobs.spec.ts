import { test, expect } from '../fixtures/fixtures';

test.describe('Ravn QA Engineer job - Minimum Requirements extraction', () => {
    test('Navigate, open QA Engineer, loop Minimum Requirements, print & assert', async ({ page, homePage, jobsPage, jobDetailsPage }) => {

        await test.step('Go to homepage', async () => {
            await homePage.goto();
            await expect(page).toHaveTitle(/ravn/i);
        });

        await test.step('Open JOBS / Careers', async () => {
            await homePage.openJobs();
            await jobsPage.assertJobsListVisible();
        });

        await test.step('Open "QA Engineer" job', async () => {
            // More permissive: any title that contains QA/Quality + Engineer (any order, words in between)
            const titleRegex = /\b(qa|quality|assurance)\b[\w\s-]*\bengineer\b|\bengineer\b[\w\s-]*\b(qa|quality|assurance)\b/i;
            await jobsPage.openJobByTitle(titleRegex);

            // If a new tab opened, ensure our JobDetailsPage uses the active page
            // DELETE this line:
            // (jobDetailsPage as any).page = jobsPage.getActivePage();


            await expect(jobDetailsPage.jobTitle()).toBeVisible();
            const titleText = (await jobDetailsPage.jobTitle().innerText()).trim();
            //  assert: it should at least contain "QA" or "Quality" and "Engineer"
            //expect.soft(/\b(qa|quality|assurance)\b/i.test(titleText)).toBeTruthy();
        });

        let requirements: string[] = [];
        await test.step('Extract requirements/qualifications', async () => {
            requirements = await jobDetailsPage.getMinimumRequirements();
            expect(requirements.length).toBeGreaterThan(0);

            console.log('--- Minimum Requirements / Qualifications ---');
            requirements.forEach((req, i) => console.log(`${i + 1}. ${req}`));
        });

        await test.step('Extra validations', async () => {
            for (const item of requirements) expect.soft(item).toMatch(/[A-Za-z]/);
            await expect(jobsPage.getActivePage()).toHaveURL(/(jobs|careers|greenhouse|lever|ashby)/i);
        });
    });
});
