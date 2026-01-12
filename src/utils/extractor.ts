export type Status = "Green" | "Yellow" | "Red" | "None";

export function statusFromClass(cls: string | null): Status {
    if (!cls) return "None";
    if (cls.includes("text-success")) return "Green";
    if (cls.includes("text-warning")) return "Yellow";
    if (cls.includes("text-danger")) return "Red";
    return "None";
}

export async function extractProperties(page): Promise<Record<string, Status>> {
    await page.waitForSelector("#resultPage table tbody tr td", { timeout: 120_000 });

    const raw = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll("#resultPage table tbody tr"));
        return rows.map((row) => {
            const tds = Array.from(row.querySelectorAll("td"));
            const name = (tds[0]?.textContent || "").trim();

            // ✅ "fa-circle" matches the dot icon; exclude "fa-info-circle"
            const icon = row.querySelector("i.fa-circle, i.fas.fa-circle");
            const cls = icon ? icon.getAttribute("class") : null;

            return { name, cls };
        });
    });

    const result: Record<string, Status> = {};
    for (const { name, cls } of raw) {
        if (!name) continue;
        result[name] = statusFromClass(cls);
    }
    return result;
}
