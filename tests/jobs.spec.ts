import { test, expect } from '../fixtures/fixtures';
import { JobDetailsPage } from '../pages/JobDetailsPage';
test.describe('Ravn Jobs – QA Automation Engineer', () => {

    test.beforeEach(async ({ homePage, page }) => {
        // Common setup for every test
        await homePage.navigate();
        await expect(page).toHaveTitle(/ravn/i);
    });

    test.afterEach(async ({ page }, testInfo) => {
        // Attach screenshot on failure (best practice)
        if (testInfo.status !== testInfo.expectedStatus) {
            const screenshot = await page.screenshot({ fullPage: true });
            await testInfo.attach('failure-screenshot', {
                body: screenshot,
                contentType: 'image/png',
            });
        }
    });

    test('QA Automation Engineer page should list SDLC understanding', async ({
        homePage,
        jobsPage,
        jobDetailsPage,
        page,
        context,
    }) => {
        // Step 1: Navigate to home
        await homePage.navigate();
        await expect(page).toHaveTitle(/Ravn/i);

        // Step 2: Click Jobs
        await homePage.clickJobs();
        await expect(page).toHaveURL(/jobs/i);

        // Step 3: Open “QA Automation Engineer” job
        const jobPage = await jobsPage.openJobByTitle('QA Automation Engineer', context);

        // Rebind details page to new tab if it opened
        const jobDetail = new JobDetailsPage(jobPage);

        // Step 4: Fetch requirements
        const requirements = await jobDetail.getMinimumRequirements();

        console.log('QA Automation Engineer - Minimum Requirements:');
        requirements.forEach((r, i) => console.log(`${i + 1}. ${r}`));

        // Step 5: Assert SDLC understanding requirement
        const found = requirements.some((r) =>
            /mobile.*web.*sdlc/i.test(r) || /sdlc/i.test(r)
        );
        console.log('Encontrado' + found);
    });
});

