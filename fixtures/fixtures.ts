import { test as base, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { JobsPage } from '../pages/JobsPage';
import { JobDetailsPage } from '../pages/JobDetailsPage';
import { ApplyPage } from '../pages/ApplyPage';

type PagesFixture = {
    homePage: HomePage;
    jobsPage: JobsPage;
    //jobDetailsPage: JobDetailsPage;
    makeJobDetailsPage: (p: Page) => JobDetailsPage;
    makeApplyPage: (p: Page) => ApplyPage;

    openJob: (title: string) => Promise<JobDetailsPage>;
};
export const test = base.extend<PagesFixture>({
    homePage: async ({ page }, use) => { await use(new HomePage(page)); },
    jobsPage: async ({ page }, use) => { await use(new JobsPage(page)); },
    //jobDetailsPage: async ({ page }, use) => { await use(new JobDetailsPage(page));},
    makeJobDetailsPage: async ({ }, use) => await use((p: Page) => new JobDetailsPage(p)),
    makeApplyPage: async ({ }, use) => await use((p: Page) => new ApplyPage(p)),

    openJob: async ({ jobsPage, context, makeJobDetailsPage }, use) => {
        await use(async (title: string) => {
            const jobPage = await jobsPage.openJobByTitle(title, context);
            return makeJobDetailsPage(jobPage);
        });
    },
});

export const expect = test.expect;