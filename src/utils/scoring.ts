import type { Status } from "./extractor";

const scoreMap: Record<string, number> = {
    "Red->Green": 2,
    "Green->Red": -2,
    "Yellow->Green": 1,
    "Green->Yellow": -1,
    "Red->Yellow": 1,
    "Yellow->Red": -1,
};

export function scoreTransition(from: Status, to: Status): number {
    return scoreMap[`${from}->${to}`] ?? 0;
}

export function buildWideScoreTable(
    parent: Record<string, Status>,
    children: Array<Record<string, Status>>
) {
    const props = Object.keys(parent);

    const rows: Array<Record<string, any>> = props.map((prop) => {
        const row: Record<string, any> = { Property: prop };

        children.forEach((childMap, idx) => {
            const from: Status = parent[prop] ?? "None";
            const to: Status = childMap[prop] ?? "None";
            row[`Score ${idx + 1}`] = scoreTransition(from, to);
        });

        return row;
    });

    const finalRow: Record<string, any> = { Property: "Final Score" };
    children.forEach((_, idx) => {
        const col = `Score ${idx + 1}`;
        finalRow[col] = rows.reduce((sum, r) => sum + (r[col] ?? 0), 0);
    });
    rows.push(finalRow);

    return rows;
}
