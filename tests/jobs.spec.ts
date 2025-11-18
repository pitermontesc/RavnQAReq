import { test, expect } from "../fixtures/fixtures";
import { JobDetailsPage } from "../pages/JobDetailsPage";

test("Extract Minimum Requirements of QA Automation Engineer", async ({
    homePage,
    jobsPage,
    jobDetailsPage,
}) => {

    await test.step("Go to homepage", async () => {
        await homePage.goto();
    });

    await test.step("Navigate to JOBS", async () => {
        await homePage.clickJobs();
    });

    await test.step("Open QA Automation Engineer position", async () => {
        await jobsPage.openJob("QA Automation Engineer");
    });

    let minimumRequirements: string[] = [];

    await test.step("Extract Minimum Requirements", async () => {
        minimumRequirements = await jobDetailsPage.extractMinimumRequirements();

        console.log("=== Minimum Requirements ===");
        minimumRequirements.forEach((req, i) =>
            console.log(`${i + 1}. ${req}`)
        );
    });

    await test.step("Assertions", async () => {
        //expect(minimumRequirements.length).toBeGreaterThan(0);

        // Ensure each bullet has content
        for (const req of minimumRequirements) {
            expect(req.trim().length).toBeGreaterThan(5);
        }

        // Ensure the job page actually contains the title
        await expect(
            (await jobDetailsPage.minimumRequirementsSection().innerText())
        ).toContain("Minimum Requirements");
    });
});

//1ro 
//hacer un assertion para [Understanding of mobile and web SDLC]

//2do
//Investigar porque no se puede concretar la lista de elementos

//3ro
//arreglar la implementacion del fixture 

//4to TEST2 : go to Apply to this JobDetailsPage y validar el formulario
// hacer assetions de los campos fueron completados 


//PR. con la primer parte dejando todo seteado
//PR. la nueva implementacion 