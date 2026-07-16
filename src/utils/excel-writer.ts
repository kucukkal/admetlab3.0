import ExcelJS from 'exceljs';

export async function writeWideExcel(rows: Array<Record<string, any>>) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("ADMET Comparison");

    const keys = Object.keys(rows[0]);
    ws.columns = keys.map((k) => ({
        header: k,
        key: k,
        width: k === "Property" ? 35 : 10,
    }));

    // Add the data rows
    rows.forEach((r) => {
        const row = ws.addRow(r);

        keys.forEach((k, colIdx) => {
            if (k === "Property") return;

            const cell = row.getCell(colIdx + 1);

            if (r[k] === "N/A") {
                cell.font = { color: { argb: "FF999999" }, italic: true };
                cell.alignment = { horizontal: "center" };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFF2F2F2" },
                };
            } else {
                cell.alignment = { horizontal: "center" };
            }
        });
    });

    // Build and add the Final Score row
    const scoreKeys = keys.filter((k) => k !== "Property");
    const finalScoreRowData: Record<string, any> = { Property: "Final Score" };

    scoreKeys.forEach((k) => {
        const total = rows.reduce((sum, r) => {
            const val = r[k];
            return typeof val === "number" ? sum + val : sum;
        }, 0);
        finalScoreRowData[k] = total;
    });

    const finalRow = ws.addRow(finalScoreRowData);

    // Style the Final Score row distinctly (bold + top border + light background)
    scoreKeys.forEach((k, idx) => {
        const cell = finalRow.getCell(idx + 2); // +2 because col 1 is "Property"
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center" };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFDDEBF7" }, // light blue highlight
        };
        cell.border = { top: { style: "thin" } };
    });

    finalRow.getCell(1).font = { bold: true };
    finalRow.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDDEBF7" },
    };
    finalRow.getCell(1).border = { top: { style: "thin" } };

    // Bold header row
    ws.getRow(1).font = { bold: true };

    await wb.xlsx.writeFile("admet_score.xlsx");
}