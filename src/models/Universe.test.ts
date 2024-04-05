import { describe, it, expect } from "bun:test";
import { Universe } from "./Universe";
import { Generation } from "./Generation";

describe("getGeneration", () => {
	it("should return the generation", () => {
		const generation = Generation.seed(10, 10);
		const universe = new Universe(generation);

		expect(universe.getGeneration()).toBe(generation);
	});
});

describe("tick", () => {
	it("should create a new generation", () => {
		const generation = Generation.seed(10, 10);
		const universe = new Universe(generation);

		universe.tick();

		expect(universe.getGeneration()).not.toBe(generation);
	});

	it.each<[string, number[][][]]>([
		[
			"block",
			[
				[
					[0, 0],
					[0, 1],
					[1, 0],
					[1, 1],
				],
				[
					[0, 0],
					[0, 1],
					[1, 0],
					[1, 1],
				],
			],
		],
		[
			"blinker",
			[
				[
					[1, 2],
					[2, 2],
					[3, 2],
				],
				[
					[2, 1],
					[2, 2],
					[2, 3],
				],
				[
					[1, 2],
					[2, 2],
					[3, 2],
				],
			],
		],
		[
			"glider",
			[
				[
					[2, 1],
					[3, 2],
					[1, 3],
					[2, 3],
					[3, 3],
				],
				[
					[1, 2],
					[3, 2],
					[2, 3],
					[3, 3],
					[2, 4],
				],
				[
					[3, 2],
					[1, 3],
					[3, 3],
					[2, 4],
					[3, 4],
				],
				[
					[2, 2],
					[3, 3],
					[4, 3],
					[2, 4],
					[3, 4],
				],
				[
					[3, 2],
					[4, 3],
					[2, 4],
					[3, 4],
					[4, 4],
				],
			],
		],
	])(
		"should create new generations with the correct live cells for a known pattern (%s)",
		(name, generations) => {
			const generation = new Generation();

			const firstGeneration = generations.shift() as number[][];
			for (const [x, y] of firstGeneration) {
				generation.setLiveCell(x, y);
			}

			const universe = new Universe(generation);

			for (const expectedLiveCells of generations) {
				universe.tick();

				const nextGeneration = universe.getGeneration();

				expect(nextGeneration.getLiveCells().size).toBe(
					expectedLiveCells.length,
				);
				for (const [x, y] of expectedLiveCells) {
					expect(nextGeneration.isLiveCell(x, y)).toBe(true);
				}
			}
		},
	);
});
