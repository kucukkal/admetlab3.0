import { Given, When, Then, After } from "@cucumber/cucumber";
import { AdmetLabPage } from "../pages/admetlab.page";
import { extractProperties } from "../utils/extractor";
import { buildWideScoreTable } from "../utils/scoring";
import { writeWideExcel } from "../utils/excel-writer";
import { DataTable } from "@cucumber/cucumber";
console.log("✅ molecule.steps.ts loaded");

Given("I evaluate the parent molecule with SMILES {string}", async function (smiles) {
    const page = new AdmetLabPage(this.page);
    await page.open();
    await page.submitSmiles(smiles);
    this.parentProps = await extractProperties(this.page);
});

Given("I evaluate the child molecule with SMILES {string}", async function (smiles) {
    const page = new AdmetLabPage(this.page);
    await page.open();
    await page.submitSmiles(smiles);
    this.childProps = await extractProperties(this.page);
});
Given("I evaluate the following child molecules:", async function (table: DataTable) {
    const rows = table.hashes() as Array<{ smiles: string }>;

    this.childPropsList = [];
    this.childSmilesList = rows.map(r => r.smiles);

    const pageObj = new AdmetLabPage(this.page);

    for (const { smiles } of rows) {
        await pageObj.open();
        await pageObj.submitSmiles(smiles);
        const props = await extractProperties(this.page);
        console.log("Child total props:", Object.keys(props).length);
        console.log(
            "Child non-None props:",
            Object.values(props).filter(v => v !== "None").length
        );
        this.childPropsList.push(props);
    }
});

When("I compare the ADMET properties", function () {
    this.scoreMatrix = buildWideScoreTable(this.parentProps, this.childPropsList);
    console.log("Excel columns:", Object.keys(this.scoreMatrix[0]));
});

Then("I generate an Excel score report", async function () {
    await writeWideExcel(this.scoreMatrix);
});

After(async function () {
    await this.cleanup();
});
