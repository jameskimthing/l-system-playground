<script lang="ts">
	import { clearCanvas, downloadBoundingBox } from '$lib/canvas';
	import Button from '$lib/inputs/Button.svelte';
	import { onMount } from 'svelte';

	export let canvas: HTMLCanvasElement;

	const canvasHeight: number = 2000;
	const canvasWidth: number = 2000;

	let scale: number = 1;
	let dragging: boolean = false;
	let x = -canvasWidth / 2 + 200;
	let y = -canvasHeight / 2 + 200;

	const scaleUp = () => (scale = Math.min(3, scale + 0.1));
	const scaleDown = () => (scale = Math.max(0.1, scale - 0.1));
	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		const scaleFactor = e.deltaY * -0.0005;
		const newScale = Math.min(Math.max(scale + scaleFactor, 0.1), 3);
		scale = newScale;
	}

	function drag(e: MouseEvent) {
		if (dragging === false) return;
		x += e.movementX;
		y += e.movementY;
	}

	function reset() {
		scale = 1;
		x = -canvasWidth / 2 + 200;
		y = -canvasHeight / 2 + 200;
	}

	let ctx: CanvasRenderingContext2D;
	onMount(() => {
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		clearCanvas(canvas, ctx);
	});
</script>

<section class="relative flex flex-col gap-2">
	<div
		class="relative w-[500px] h-[500px] shadow shadow-black rounded overflow-clip"
		on:pointerdown={() => (dragging = true)}
		on:pointerup={() => (dragging = false)}
		on:pointerleave={() => (dragging = false)}
		on:pointercancel={() => (dragging = false)}
		on:wheel={handleWheel}
		on:pointermove={drag}
	>
		<canvas
			class="absolute top-0 left-0 origin-top-left border-8 border-blue-500 rounded cursor-move canvas"
			style="transform: scale({scale}, {scale}) translate({x}px, {y}px)"
			height={canvasHeight}
			width={canvasWidth}
			bind:this={canvas}
		/>
	</div>
	<div class="absolute flex flex-col gap-2 font-mono w-min top-2 left-2">
		<div class="flex flex-row gap-2">
			<button class="px-2 py-[2px] bg-gray-300 rounded" on:pointerup={scaleUp}>+</button>
			<button class="px-2 py-[2px] bg-gray-300 rounded" on:pointerup={scaleDown}>-</button>
		</div>
		<button class="px-2 py-[2px] bg-gray-300 rounded w-full" on:pointerup={reset}>reset</button>
	</div>
	<Button onClick={async () => await downloadBoundingBox(canvas)} text="Download as Image" />
	<!-- <button on:click={() => downloadBoundingBox(canvas, ctx)}>download</button> -->
</section>
