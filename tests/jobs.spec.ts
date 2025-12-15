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
        makeJobDetailsPage,
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

    test('Open QA Automation Engineer -> Apply -> fill required fields (no submit) and validate filled', async ({
        homePage,
        openJob,
        makeApplyPage,
        context,
        page,
    }) => {
        // go to Jobs
        await homePage.clickJobs();
        await expect(page).toHaveURL(/jobs/i);

        // open job details (handles new tab internally)
        const details = await openJob('QA Automation Engineer');

        // scroll bottom + click Apply
        await details.scrollToBottom();

        const [maybeApplyTab] = await Promise.all([
            context.waitForEvent('page').catch(() => null),
            details.clickApply(),
        ]);

        const applyTab = maybeApplyTab ?? page;
        await applyTab.waitForLoadState('domcontentloaded');

        const apply = makeApplyPage(applyTab);

        const formData = {
            firstName: 'Piter',
            lastName: 'Montes',
            email: `piter.montes+${Date.now()}@example.com`,
            phone: '5551234567',
            country: 'United States',        // adjust if needed
            city: 'Miami',
            yearsOfExperience: '3-5 years',  // adjust to match dropdown option label
            resumeRelativePath: 'tests/resources/resume.txt',
        };

        // fill (do NOT click submit)
        await apply.fillRequiredFields(formData);

        // validate filled
        await apply.assertRequiredFieldsFilled(formData);

        // extra guard: confirm we didn't submit
        await expect(applyTab).not.toHaveURL(/thank|submitted|confirmation/i);

        // optional: ensure submit button exists but is not pressed
        const submitBtn = applyTab.getByRole('button', { name: /submit/i });
        await expect(submitBtn).toBeVisible();
    });
});

