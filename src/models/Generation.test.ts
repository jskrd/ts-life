import { describe, it, expect } from "bun:test";
import { Generation } from "./Generation";

describe("encodeCoords", () => {
	it("should encode zero coordinates", () => {
		expect(Generation.encodeCoords(0, 0)).toBe("0,0");
	});

	it("should encode negative coordinates", () => {
		expect(Generation.encodeCoords(-1, -1)).toBe("-1,-1");
	});

	it("should encode mixed coordinates", () => {
		expect(Generation.encodeCoords(-1, 1)).toBe("-1,1");
	});

	it("should encode large coordinates", () => {
		expect(Generation.encodeCoords(999, 999)).toBe("999,999");
	});
});

describe("decodeCoords", () => {
	it("should decode zero coordinates", () => {
		expect(Generation.decodeCoords("0,0")).toEqual([0, 0]);
	});

	it("should decode negative coordinates", () => {
		expect(Generation.decodeCoords("-1,-1")).toEqual([-1, -1]);
	});

	it("should decode mixed coordinates", () => {
		expect(Generation.decodeCoords("-1,1")).toEqual([-1, 1]);
	});

	it("should decode large coordinates", () => {
		expect(Generation.decodeCoords("999,999")).toEqual([999, 999]);
	});
});

describe("getLiveCells", () => {
	it("should return an empty map", () => {
		const generation = new Generation();

		expect(generation.getLiveCells()).toEqual(new Map());
	});

	it("should return a map with one live cell", () => {
		const generation = new Generation();
		generation.setLiveCell(0, 0);

		expect(generation.getLiveCells()).toEqual(new Map([["0,0", true]]));
	});

	it("should return a map with multiple live cells", () => {
		const generation = new Generation();
		generation.setLiveCell(0, 0);
		generation.setLiveCell(1, 1);

		expect(generation.getLiveCells()).toEqual(
			new Map([
				["0,0", true],
				["1,1", true],
			]),
		);
	});

	it("should return a map with multiple live cells in random order", () => {
		const generation = new Generation();
		generation.setLiveCell(1, 1);
		generation.setLiveCell(0, 0);

		expect(generation.getLiveCells()).toEqual(
			new Map([
				["0,0", true],
				["1,1", true],
			]),
		);
	});
});

describe("isLiveCell", () => {
	it("should return false for an empty generation", () => {
		const generation = new Generation();

		expect(generation.isLiveCell(0, 0)).toBe(false);
	});

	it("should return true for a live cell", () => {
		const generation = new Generation();
		generation.setLiveCell(0, 0);

		expect(generation.isLiveCell(0, 0)).toBe(true);
	});

	it("should return false for a dead cell", () => {
		const generation = new Generation();
		generation.setLiveCell(0, 0);

		expect(generation.isLiveCell(1, 1)).toBe(false);
	});
});

describe("setLiveCell", () => {
	it("should set a live cell", () => {
		const generation = new Generation();
		generation.setLiveCell(0, 0);

		expect(generation.getLiveCells()).toEqual(new Map([["0,0", true]]));
	});

	it("should set multiple live cells", () => {
		const generation = new Generation();
		generation.setLiveCell(0, 0);
		generation.setLiveCell(1, 1);

		expect(generation.getLiveCells()).toEqual(
			new Map([
				["0,0", true],
				["1,1", true],
			]),
		);
	});

	it("should override a live cell", () => {
		const generation = new Generation();
		generation.setLiveCell(0, 0);
		generation.setLiveCell(0, 0);

		expect(generation.getLiveCells()).toEqual(new Map([["0,0", true]]));
	});
});

describe("countLiveNeighbors", () => {
	it("should return zero for an empty generation", () => {
		const generation = new Generation();

		expect(generation.countLiveNeighbors(0, 0)).toBe(0);
	});

	it("should return zero for a generation with one live cell", () => {
		const generation = new Generation();
		generation.setLiveCell(0, 0);

		expect(generation.countLiveNeighbors(0, 0)).toBe(0);
	});

	it("should return one for a generation with one live cell and one live neighbor", () => {
		const generation = new Generation();
		generation.setLiveCell(0, 0);
		generation.setLiveCell(1, 1);

		expect(generation.countLiveNeighbors(0, 0)).toBe(1);
	});

	it("should return two for a generation with one live cell and two live neighbors", () => {
		const generation = new Generation();
		generation.setLiveCell(0, 0);
		generation.setLiveCell(1, 1);
		generation.setLiveCell(1, 0);

		expect(generation.countLiveNeighbors(0, 0)).toBe(2);
	});

	it("should return eight for a generation with one live cell and eight live neighbors", () => {
		const generation = new Generation();
		generation.setLiveCell(-1, -1);
		generation.setLiveCell(0, -1);
		generation.setLiveCell(1, -1);
		generation.setLiveCell(-1, 0);
		generation.setLiveCell(0, 0);
		generation.setLiveCell(1, 0);
		generation.setLiveCell(-1, 1);
		generation.setLiveCell(0, 1);
		generation.setLiveCell(1, 1);

		expect(generation.countLiveNeighbors(0, 0)).toBe(8);
	});

	it.each<[number, number]>([
		[-1, -1],
		[0, -1],
		[1, -1],
		[1, 0],
		[1, 1],
		[0, 1],
		[-1, 1],
		[-1, 0],
	])(
		"should return one for a generation with one live cell and one live neighbor at (%i, %i)",
		(x, y) => {
			const generation = new Generation();
			generation.setLiveCell(0, 0);
			generation.setLiveCell(x, y);

			expect(generation.countLiveNeighbors(0, 0)).toBe(1);
		},
	);

	it.each<[number, number]>([
		[-2, -2],
		[-1, -2],
		[0, -2],
		[1, -2],
		[2, -2],
		[2, -1],
		[2, 0],
		[2, 1],
		[2, 2],
		[1, 2],
		[0, 2],
		[-1, 2],
		[-2, 2],
		[-2, 1],
		[-2, 0],
		[-2, -1],
	])(
		"should return zero for a generation with one live cell and one live non-neighbor at (%i, %i)",
		(x, y) => {
			const generation = new Generation();
			generation.setLiveCell(0, 0);
			generation.setLiveCell(x, y);

			expect(generation.countLiveNeighbors(0, 0)).toBe(0);
		},
	);
});

describe("shouldCellLive", () => {
	it("should return false for a dead cell with zero live neighbors", () => {
		const generation = new Generation();

		expect(generation.countLiveNeighbors(0, 0)).toBe(0);
		expect(generation.shouldCellLive(0, 0)).toBe(false);
	});

	it("should return false for a dead cell with one live neighbor", () => {
		const generation = new Generation();
		generation.setLiveCell(1, 1);

		expect(generation.countLiveNeighbors(0, 0)).toBe(1);
		expect(generation.shouldCellLive(0, 0)).toBe(false);
	});

	it("should return false for a dead cell with two live neighbors", () => {
		const generation = new Generation();
		generation.setLiveCell(0, -1);
		generation.setLiveCell(1, -1);

		expect(generation.countLiveNeighbors(0, 0)).toBe(2);
		expect(generation.shouldCellLive(0, 0)).toBe(false);
	});

	it("should return true for a dead cell with three live neighbors", () => {
		const generation = new Generation();
		generation.setLiveCell(-1, -1);
		generation.setLiveCell(0, -1);
		generation.setLiveCell(1, -1);

		expect(generation.countLiveNeighbors(0, 0)).toBe(3);
		expect(generation.shouldCellLive(0, 0)).toBe(true);
	});

	it("should return false for a dead cell with four live neighbors", () => {
		const generation = new Generation();
		generation.setLiveCell(-1, -1);
		generation.setLiveCell(0, -1);
		generation.setLiveCell(1, -1);
		generation.setLiveCell(-1, 0);

		expect(generation.countLiveNeighbors(0, 0)).toBe(4);
		expect(generation.shouldCellLive(0, 0)).toBe(false);
	});

	it("should return false for a live cell with one live neighbor", () => {
		const generation = new Generation();
		generation.setLiveCell(0, 0);
		generation.setLiveCell(1, 1);

		expect(generation.countLiveNeighbors(0, 0)).toBe(1);
		expect(generation.shouldCellLive(0, 0)).toBe(false);
	});

	it("should return true for a live cell with two live neighbors", () => {
		const generation = new Generation();
		generation.setLiveCell(0, 0);
		generation.setLiveCell(1, 1);
		generation.setLiveCell(1, 0);

		expect(generation.countLiveNeighbors(0, 0)).toBe(2);
		expect(generation.shouldCellLive(0, 0)).toBe(true);
	});

	it("should return true for a live cell with three live neighbors", () => {
		const generation = new Generation();
		generation.setLiveCell(-1, -1);
		generation.setLiveCell(0, -1);
		generation.setLiveCell(1, -1);
		generation.setLiveCell(0, 0);

		expect(generation.countLiveNeighbors(0, 0)).toBe(3);
		expect(generation.shouldCellLive(0, 0)).toBe(true);
	});

	it("should return false for a live cell with four live neighbors", () => {
		const generation = new Generation();
		generation.setLiveCell(-1, -1);
		generation.setLiveCell(0, -1);
		generation.setLiveCell(1, -1);
		generation.setLiveCell(-1, 0);
		generation.setLiveCell(0, 0);

		expect(generation.countLiveNeighbors(0, 0)).toBe(4);
		expect(generation.shouldCellLive(0, 0)).toBe(false);
	});
});
