<script lang="ts">
	import Button from '$lib/inputs/Button.svelte';
	import NumberInput from '$lib/inputs/NumberInput.svelte';
	import TextInput from '$lib/inputs/TextInput.svelte';
	import { possibleActions, type FormParameters } from '$lib/l-systems';
	import { presets } from '$lib/presets';
	import {
		actionsToString,
		parseActions,
		parseRules,
		rulesToString,
		showIf,
		splitAndCapitalize
	} from '$lib/utilities';
	import { slide } from 'svelte/transition';

	export let onSubmit: Function;
	export let parameters: FormParameters;

	let loading: boolean = false;

	let rulesString: string = '';
	let actionsString: string = '';

	let rulesError: string = '';
	let actionsError: string = '';

	// let variables: string[] = [];
	$: [parameters.rules, rulesError] = parseRules(rulesString);
	$: [parameters.actions, actionsError] = parseActions(actionsString);

	let preset: string;
	$: preset ? setParameters() : resetParameters();
	const resetParameters = () => {
		parameters.axiom = '';
		rulesString = '';
		actionsString = '';
		parameters.rules = {};
		parameters.actions = {};

		// @ts-ignore
		parameters.angle = null; // @ts-ignore
		parameters.iterationCount = null; // @ts-ignore
		parameters.length = null;
	};
	const setPreset = (e: any) => (preset = e.target.value);
	const setParameters = () => {
		const { axiom, rules, actions, defaults } = presets[preset];
		const { angle, iterationCount, length } = defaults;

		parameters.axiom = axiom;
		rulesString = rulesToString(rules);
		parameters.rules = rules;
		actionsString = actionsToString(actions);
		parameters.actions = actions;
		parameters.angle = angle;
		parameters.iterationCount = iterationCount;
		parameters.length = length;
	};
</script>

<form
	on:submit|preventDefault={async () => {
		loading = true;
		await onSubmit();
		loading = false;
	}}
	class="flex flex-col gap-2 w-[400px] items-center p-5 rounded shadow shadow-black font-mono"
>
	<label>
		<h2 class="text-sm">Choose a preset</h2>
		<select bind:value={preset} on:change={setPreset} class="px-2 py-1 rounded">
			{#each ['', ...Object.keys(presets)] as value}
				<option {value}>{splitAndCapitalize(value)}</option>
			{/each}
		</select>
	</label>

	<TextInput placeholder="FGG" label="axiom" bind:value={parameters.axiom} />
	<TextInput placeholder={`F=FGFGF;\nG=GG`} label="rules" bind:value={rulesString} />
	{#if rulesError}
		<div class="text-sm italic text-red-500">{rulesError}</div>
	{/if}
	<TextInput
		placeholder={`F=[draw];\nG=[left, draw]`}
		label="actions: {Array.from(possibleActions).join(', ')}"
		bind:value={actionsString}
	/>
	{#if actionsError}
		<div class="text-sm italic text-red-500">{actionsError}</div>
	{/if}
	<NumberInput label="angle" bind:value={parameters.angle} />
	<NumberInput label="iteration count" bind:value={parameters.iterationCount} />
	<NumberInput label="length of each stroke" bind:value={parameters.length} />
	<!-- <div class="h-5 mt-auto" /> -->
	<div />
	<div class="flex flex-row justify-around w-full gap-2 mt-auto">
		{#if Object.keys(parameters.rules).length !== 0}
			<div class="flex flex-col gap-2 w-min" transition:slide>
				<div class="text-sm">Rules:</div>
				{#each Object.entries(parameters.rules) as [key, value]}
					<div class="flex flex-row w-full gap-2">
						<div class="px-2 py-1 bg-gray-100 rounded whitespace-nowrap">{key}</div>
						<div class="w-full px-2 py-1 text-center bg-gray-100 rounded whitespace-nowrap">
							{value}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if Object.keys(parameters.actions).length !== 0}
			<div class="flex flex-col gap-2 w-min" transition:slide>
				<div class="text-sm">Actions:</div>
				{#each Object.entries(parameters.actions) as [key, value]}
					<div class="flex flex-row w-full gap-2">
						<!-- <div class="whitespace-nowrap">{key}={value.join(' ')}</div> -->
						<div class="px-2 py-1 bg-gray-100 rounded whitespace-nowrap">{key}</div>
						<div class="w-full px-2 py-1 text-center bg-gray-100 rounded whitespace-nowrap">
							{value.join(' ')}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
	<Button bind:loading />
</form>
