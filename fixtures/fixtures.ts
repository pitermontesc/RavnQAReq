import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { JobsPage } from '../pages/JobsPage';
import { JobDetailsPage } from '../pages/JobDetailsPage';

type PagesFixture = {
    homePage: HomePage;
    jobsPage: JobsPage;
    jobDetailsPage: JobDetailsPage;
};

export const test = base.extend<PagesFixture>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    jobsPage: async ({ page }, use) => {
        await use(new JobsPage(page));
    },
    jobDetailsPage: async ({ page }, use) => {
        await use(new JobDetailsPage(page));
    },
});

export const expect = test.expect;