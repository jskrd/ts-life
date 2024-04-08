import { Generation } from "./models/Generation";
import { Universe } from "./models/Universe";
import { resizeCanvasToViewport } from "./utils";

export function play(): void {
	const canvas = document.getElementById("app");
	if (!(canvas instanceof HTMLCanvasElement)) {
		throw new Error("Canvas not found");
	}

	const scale = 4;

	resizeCanvasToViewport(canvas, scale);

	const generation = Generation.seed(
		canvas.width / scale,
		canvas.height / scale,
	);
	const universe = new Universe(generation);

	const context = canvas.getContext("2d");
	if (!(context instanceof CanvasRenderingContext2D)) {
		throw new Error("Canvas context not found");
	}

	const tick = () => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(universe.toCanvas(canvas.width, canvas.height), 0, 0);

		universe.tick();
	};

	setInterval(tick, 100);
}
