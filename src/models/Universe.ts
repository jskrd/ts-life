import { Generation } from "./Generation";

export class Universe {
	private generation: Generation;

	constructor(generation: Generation) {
		this.generation = generation;
	}

	public getGeneration(): Generation {
		return this.generation;
	}

	public tick(): void {
		const newGeneration = new Generation();

		for (const [key] of this.generation.getLiveCells()) {
			const [x, y] = Generation.decodeCoords(key);

			for (let dx = -1; dx <= 1; dx++) {
				for (let dy = -1; dy <= 1; dy++) {
					if (dx === 0 && dy === 0) {
						continue;
					}

					const nx = x + dx;
					const ny = y + dy;
					if (this.generation.shouldCellLive(nx, ny)) {
						newGeneration.setLiveCell(nx, ny);
					}
				}
			}
		}

		this.generation = newGeneration;
	}

	public toCanvas(width: number, height: number): HTMLCanvasElement {
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		const context = canvas.getContext("2d");
		if (!(context instanceof CanvasRenderingContext2D)) {
			throw new Error("Canvas context not found");
		}

		for (const [key] of this.generation.getLiveCells()) {
			const [x, y] = Generation.decodeCoords(key);

			if (x < 0 || x >= width || y < 0 || y >= height) {
				continue;
			}

			context.fillStyle = "white";
			context.fillRect(x, y, 1, 1);
		}

		return canvas;
	}
}
