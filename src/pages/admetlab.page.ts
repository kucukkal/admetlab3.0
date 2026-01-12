import { Page } from "playwright";

export class AdmetLabPage {
    constructor(private page: Page) {}

    async open() {
        this.page.setDefaultNavigationTimeout(120_000);

        await this.page.goto("https://admetlab3.scbdd.com/server/evaluationCal", {
            waitUntil: "domcontentloaded",
            timeout: 120_000,
        });

        // Wait for the SMILES input to exist
        await this.page.waitForSelector("#smiles", { timeout: 60_000 });
    }

    async submitSmiles(smiles: string) {
        await this.page.fill("#smiles", smiles);
        await this.page.click("button:has-text('Submit')");

        // Wait for results container
        await this.page.waitForSelector("#resultPage", { timeout: 120_000 });

        // Wait for rows
        await this.page.waitForSelector("#resultPage table tbody tr", { timeout: 120_000 });

        // ✅ Wait until at least some colored circles exist
        await this.page.waitForSelector("#resultPage i.fa-circle, #resultPage i.fas.fa-circle", {
            timeout: 120_000,
        });

        // ✅ Optional: stabilize circle count (prevents partial render)
        await this.waitForCountToStabilize("#resultPage i.fa-circle, #resultPage i.fas.fa-circle", 500, 3);
    }

    private async waitForCountToStabilize(selector: string, intervalMs: number, stableChecks: number) {
        let last = -1;
        let stable = 0;

        while (stable < stableChecks) {
            const current = await this.page.locator(selector).count();
            if (current === last && current > 0) stable++;
            else stable = 0;

            last = current;
            await this.page.waitForTimeout(intervalMs);
        }
    }


    private async waitForRowCountToStabilize(selector: string, intervalMs: number, stableChecks: number) {
        let last = -1;
        let stable = 0;

        while (stable < stableChecks) {
            const current = await this.page.locator(selector).count();
            if (current === last && current > 0) stable++;
            else stable = 0;

            last = current;
            await this.page.waitForTimeout(intervalMs);
        }
    }
}
