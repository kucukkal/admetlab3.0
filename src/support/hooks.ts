import { Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import fs from "fs";
import path from "path";

setDefaultTimeout(120 * 1000); // 120
const EXCEL_PATH = path.resolve("admet_score.xlsx");

Before(async function () {
    // delete existing Excel file if it
    if (fs.existsSync(EXCEL_PATH)) {
        fs.unlinkSync(EXCEL_PATH);
        console.log("🧹 Deleted existing Excel file")
    }
      await this.init();
           // Playwright timeouts (NOT Cucumber)
       this.page.setDefaultTimeout(120 * 1000);
       this.page.setDefaultNavigationTimeout(120 * 1000);


    });

After(async function () {
    // keep your existing cleanup or move it here
    // await this.cleanup();
});
