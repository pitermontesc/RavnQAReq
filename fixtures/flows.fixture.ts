import { test as base } from './factories.fixture';
import { JobDetailsPage } from '../pages/JobDetailsPage';

type FlowsFixtures = {
    openJob: (title: string) => Promise<JobDetailsPage>;
};

export const test = base.extend<FlowsFixtures>({
    openJob: async ({ jobsPage, context, makeJobDetailsPage }, use) => {
        await use(async (title: string) => {
            const jobPage = await jobsPage.openJobByTitle(title, context);
            return makeJobDetailsPage(jobPage);
        });
    },
});
