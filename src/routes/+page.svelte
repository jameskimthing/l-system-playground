<script lang="ts">
	import { onMount } from 'svelte';
	import Form from './Form.svelte';
	import Info from './Info.svelte';
	import Canvas from './Canvas.svelte';
	import { formSubmitDraw } from '$lib/canvas';
	import type { FormParameters } from '$lib/l-systems';

	let parameters: FormParameters = {
		axiom: '',
		rules: {},
		actions: {},
		angle: 45,
		iterationCount: 5,
		length: 2
	};

	// let canvasHeight: number = 1000;
	// let canvasWidth: number = 1000;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	onMount(() => (ctx = canvas.getContext('2d') as CanvasRenderingContext2D));
</script>

<div class="flex flex-row items-center justify-center w-full h-full p-10">
	<div class="flex flex-col gap-5 w-min">
		<h1 class="w-full px-4 py-4 text-3xl text-center rounded shadow shadow-black">
			Make your custom L-System!
		</h1>
		<div class="flex flex-row gap-5 h-min">
			<Form onSubmit={() => formSubmitDraw(canvas, ctx, parameters)} bind:parameters />
			<Info />
			<Canvas bind:canvas />
		</div>
	</div>
</div>
