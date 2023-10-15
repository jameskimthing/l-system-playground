import greenlet from 'greenlet';
import { get, writable, type Writable } from 'svelte/store';

type LSystemAction = 'draw' | 'right' | 'left' | 'push' | 'pop';
interface FormParameters {
	axiom: string;
	rules: { [key: string]: string };
	actions: { [key: string]: LSystemAction[] };
	angle: number;
	iterationCount: number;
	length: number;
}

interface DrawingOptions {
	expression: string;
	actions: { [key: string]: string[] };
	angle: number;
	strokeLength: number;
	initialX: number;
	initialY: number;
	ctx: CanvasRenderingContext2D;
}

const iterateThroughRules = greenlet(
	async (axiom: string, rules: { [key: string]: string }, iterationCount: number) => {
		let currentIteration: string = axiom;

		for (let i: number = 0; i < iterationCount; i++) {
			let newIteration: string = '';
			for (let index: number = 0; index < currentIteration.length; index++) {
				let variable: string = currentIteration.charAt(index);
				if (variable in rules) newIteration += rules[variable];
				else newIteration += variable;
			}
			currentIteration = newIteration;
		}
		return currentIteration;
	}
);

let drawingSkipCount: number = 0;
const isDrawing: Writable<boolean> = writable(false);
const waitDrawingCycle = async (onlyWait: boolean = false) => {
	if (onlyWait) await new Promise((r) => setTimeout(r, 50));
	else {
		if (drawingSkipCount < 5) drawingSkipCount++;
		else {
			drawingSkipCount = 0;
			await new Promise((r) => setTimeout(r, 50));
		}
	}
};
const drawExpression = async (options: DrawingOptions) => {
	let x: number = options.initialX;
	let y: number = options.initialY;
	let currentRotation: number = 0;
	const stack: { x: number; y: number; currentRotation: number }[] = [];

	const { ctx, strokeLength, angle } = options;

	for (let i = 0; i < options.expression.length; i++) {
		const actions = options.actions[options.expression.charAt(i)];
		if (!actions) continue;
		for (const action of actions) {
			if (!get(isDrawing)) return;

			switch (action) {
				case 'draw':
					await waitDrawingCycle();

					let destinationX: number = x + Math.cos(currentRotation) * strokeLength;
					let destinationY: number = y + Math.sin(currentRotation) * strokeLength;

					ctx.moveTo(x, y);
					ctx.lineTo(destinationX, destinationY);
					ctx.stroke();
					ctx.closePath();

					x = destinationX;
					y = destinationY;
					break;
				case 'right':
					currentRotation += angle;
					break;
				case 'left':
					currentRotation -= angle;
					break;
				case 'push':
					stack.push({ x: x, y: y, currentRotation: currentRotation });
					break;
				case 'pop':
					const layer = stack.pop()!;
					x = layer.x;
					y = layer.y;
					currentRotation = layer.currentRotation;
					break;
			}
		}
	}
};

const possibleActions: Set<LSystemAction> = new Set(['draw', 'right', 'left', 'push', 'pop']);

export { iterateThroughRules, possibleActions, drawExpression, isDrawing, waitDrawingCycle };
export type { LSystemAction, FormParameters };
