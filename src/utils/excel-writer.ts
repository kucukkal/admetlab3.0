import * as ExcelJS from "exceljs";

export async function writeWideExcel(rows: Array<Record<string, any>>) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("ADMET Comparison");

    const keys = Object.keys(rows[0]); // e.g. Property, Score 1, Score 2...
    ws.columns = keys.map((k) => ({
        header: k,
        key: k,
        width: k === "Property" ? 35 : 10,
    }));

    rows.forEach((r) => ws.addRow(r));

    await wb.xlsx.writeFile("admet_score.xlsx");
}
