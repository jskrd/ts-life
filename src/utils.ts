export function resizeCanvasToViewport(
	canvas: HTMLCanvasElement,
	scale: number,
): void {
	const resize = () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const context = canvas.getContext("2d");
		if (!(context instanceof CanvasRenderingContext2D)) {
			throw new Error("Canvas context not found");
		}

		context.imageSmoothingEnabled = false;
		context.scale(scale, scale);
	};

	resize();
	window.addEventListener("resize", resize);
}
