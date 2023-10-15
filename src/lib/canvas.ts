import { get } from 'svelte/store';
import {
	isDrawing,
	iterateThroughRules,
	waitDrawingCycle,
	type FormParameters,
	drawExpression
} from './l-systems';
import greenlet from 'greenlet';

async function formSubmitDraw(
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	parameters: FormParameters
) {
	if (get(isDrawing)) {
		isDrawing.set(false);
		await waitDrawingCycle(true);
	}
	clearCanvas(canvas, ctx);
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 1;
	ctx.beginPath();
	const expression = await iterateThroughRules(
		parameters.axiom,
		parameters.rules,
		parameters.iterationCount
	);

	isDrawing.set(true);
	drawExpression({
		expression: expression,
		actions: parameters.actions,
		angle: parameters.angle * (Math.PI / 180),
		strokeLength: parameters.length,
		initialX: canvas.width / 2,
		initialY: canvas.height / 2,
		ctx: ctx
	}).then(() => isDrawing.set(false));
}

const gridSpacing = 20;
function clearCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = '#ffffff';
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = '#ccc';
	ctx.lineWidth = 1;
	for (let x = 0; x <= canvas.width; x += gridSpacing) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
		ctx.stroke();
	}

	// Draw horizontal lines
	for (let y = 0; y <= canvas.height; y += gridSpacing) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
		ctx.stroke();
	}
}

const getBoundingBox = greenlet(async (data: Uint8ClampedArray, width: number, height: number) => {
	let minX = width;
	let minY = height;
	let maxX = 0;
	let maxY = 0;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = (y * width + x) * 4;
			const r = data[i];
			const a = data[i + 3];

			if (r <= 30 && a > 0) {
				minX = Math.min(minX, x);
				minY = Math.min(minY, y);
				maxX = Math.max(maxX, x);
				maxY = Math.max(maxY, y);
			}
		}
	}

	console.log({ x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 });
	if (minX <= maxX && minY <= maxY)
		return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
	else return null;
});

const padding = 5;
async function downloadBoundingBox(oldCanvas: HTMLCanvasElement) {
	const canvas = document.createElement('canvas');
	canvas.height = oldCanvas.height;
	canvas.width = oldCanvas.width;
	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(oldCanvas, 0, 0);

	const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imgData.data;

	// let minX = canvas.width;
	// let minY = canvas.height;
	// let maxX = 0;
	// let maxY = 0;
	for (let i = 0; i < data.length; i += 4) {
		const r = data[i];
		// const g = data[i + 1];
		// const b = data[i + 2];
		const a = data[i + 3];

		if (r > 100) {
			// data[i] = 255;
			// data[i + 1] = 255;
			// data[i + 2] = 255;
			data[i + 3] = 0;
		} else if (r <= 10 && a > 0) {
			// const x = i % canvas.width;
			// const y = Math.floor(i / canvas.width);
			// minX = Math.min(minX, x);
			// minY = Math.min(minY, y);
			// maxX = Math.max(maxX, x);
			// maxY = Math.max(maxY, y);
			// console.log(x);
			// console.log(y);
			// return;
		}
	}

	ctx.putImageData(imgData, 0, 0);

	const boundingBox = await getBoundingBox(data, canvas.width, canvas.height);
	if (!boundingBox) return alert('no bounding box!');
	// const boundingBox = { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
	// console.log(boundingBox);

	const newCanvas = document.createElement('canvas');
	newCanvas.width = boundingBox.width + padding * 2;
	newCanvas.height = boundingBox.height + padding * 2;

	const newCtx = newCanvas.getContext('2d')!;
	newCtx.drawImage(
		canvas,
		boundingBox.x - padding,
		boundingBox.y - padding,
		boundingBox.width + padding * 2,
		boundingBox.height + padding * 2,
		0,
		0,
		boundingBox.width + padding * 2,
		boundingBox.height + padding * 2
	);

	const dataUrl = newCanvas.toDataURL('image/png');
	const a = document.createElement('a');
	a.href = dataUrl;
	a.download = 'bounding-box.png';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

export { formSubmitDraw, clearCanvas, downloadBoundingBox };
