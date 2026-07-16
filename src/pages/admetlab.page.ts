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

    async submitSmiles(smiles: string): Promise<boolean> {
        await this.page.fill("#smiles", smiles);
        await this.page.click("button:has-text('Submit')");

        const errorLocator = this.page.locator('div[class*="alert-warning"]:visible', {
            hasText: 'The SMILES is invalid! please check!',
        });
        const resultLocator = this.page.locator('#resultPage');
        const SUBMIT_TIMEOUT = 180_000; // bumped from 120s to 180s

        const outcome = await Promise.race([
            errorLocator.waitFor({ state: 'visible', timeout: SUBMIT_TIMEOUT }).then(() => 'error' as const),
            resultLocator.waitFor({ state: 'visible', timeout: SUBMIT_TIMEOUT }).then(() => 'success' as const),
        ]).catch(() => 'timeout' as const);

        if (outcome === 'error') {
            return false; // invalid SMILES, nothing more to wait for
        }

        if (outcome === 'timeout') {
            throw new Error(`Timed out waiting for either result or error message for SMILES: ${smiles}`);
        }

        // outcome === 'success' -> continue waiting for full render as before
        await this.page.waitForSelector("#resultPage table tbody tr", { timeout: 120_000 });

        await this.page.waitForSelector("#resultPage i.fa-circle, #resultPage i.fas.fa-circle", {
            timeout: 120_000,
        });

        await this.waitForCountToStabilize("#resultPage i.fa-circle, #resultPage i.fas.fa-circle", 500, 3);

        return true; // valid SMILES, results fully rendered
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
