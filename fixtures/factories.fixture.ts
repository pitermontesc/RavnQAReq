import { test as base } from './pages.fixture';
import { Page } from '@playwright/test';
import { JobDetailsPage } from '../pages/JobDetailsPage';
import { ApplyPage } from '../pages/ApplyPage';

type FactoriesFixtures = {
    makeJobDetailsPage: (p: Page) => JobDetailsPage;
    makeApplyPage: (p: Page) => ApplyPage;
};

export const test = base.extend<FactoriesFixtures>({
    makeJobDetailsPage: async ({ }, use) => {
        await use((p: Page) => new JobDetailsPage(p));
    },
    makeApplyPage: async ({ }, use) => {
        await use((p: Page) => new ApplyPage(p));
    },
});
