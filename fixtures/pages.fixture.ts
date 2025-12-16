import { test as base } from './base';
import { HomePage } from '../pages/HomePage';
import { JobsPage } from '../pages/JobsPage';

type PagesFixtures = {
    homePage: HomePage;
    jobsPage: JobsPage;
};

export const test = base.extend<PagesFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    jobsPage: async ({ page }, use) => {
        await use(new JobsPage(page));
    },
});
