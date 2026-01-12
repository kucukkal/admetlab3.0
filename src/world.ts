import { setWorldConstructor } from "@cucumber/cucumber";
import { Browser, Page, chromium } from "playwright";

export class CustomWorld {
    browser!: Browser;
    page!: Page;
    childPropsList: Array<Record<string, string>> = [];
    childSmilesList: string[] = [];
    scoreMatrix: any[] = [];
    parentProps: Record<string, string> = {};
    childProps: Record<string, string> = {};
    scoreSheet: any[] = [];

    async init() {
        const headless = process.env.HEADLESS !== "false";
        this.browser = await chromium.launch({
            headless,
            slowMo: headless ? 0 : 200, // helps you see actions in headed mode
        });
        this.page = await this.browser.newPage();
    }

    async cleanup() {
        await this.browser.close();
    }
}

setWorldConstructor(CustomWorld);
