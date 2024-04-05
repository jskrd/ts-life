export class Generation {
	private liveCells: Map<string, boolean>;

	constructor() {
		this.liveCells = new Map();
	}

	public static encodeCoords(x: number, y: number): string {
		return `${x},${y}`;
	}

	public static decodeCoords(key: string): [number, number] {
		return key.split(",").map(Number) as [number, number];
	}

	public getLiveCells(): Map<string, boolean> {
		return this.liveCells;
	}

	public isLiveCell(x: number, y: number): boolean {
		return this.liveCells.get(Generation.encodeCoords(x, y)) || false;
	}

	public setLiveCell(x: number, y: number): void {
		this.liveCells.set(Generation.encodeCoords(x, y), true);
	}

	public countLiveNeighbors(x: number, y: number): number {
		let count = 0;

		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				if (dx === 0 && dy === 0) {
					continue;
				}

				if (this.isLiveCell(x + dx, y + dy)) {
					count++;
				}
			}
		}

		return count;
	}

	public shouldCellLive(x: number, y: number): boolean {
		const liveNeighbors = this.countLiveNeighbors(x, y);

		return this.isLiveCell(x, y)
			? liveNeighbors === 2 || liveNeighbors === 3
			: liveNeighbors === 3;
	}

	public static seed(width: number, height: number): Generation {
		const generation = new Generation();

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				if (Math.random() < 0.5) {
					generation.setLiveCell(x, y);
				}
			}
		}

		return generation;
	}
}
