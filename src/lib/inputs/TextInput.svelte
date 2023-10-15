<!-- <script lang="ts">
	export let label: string;
	export let value: string;
	export let placeholder: string;

	export let onInput: Function = () => {};
</script>

<label class="flex flex-col w-full">
	<div class="text-sm">{label}</div>

	<textarea
		class="w-full h-auto px-2 py-1 bg-gray-500 rounded bg-opacity-10"
		bind:value
		{placeholder}
		on:input={(v) => onInput(v)}
	/>
</label> -->

<script lang="ts">
	export let label: string;
	export let value: string;
	export let placeholder: string;
	export let onInput: Function = () => {};

	let textarea: HTMLElement;
	async function autoExpand() {
		if (!textarea) return;
		await new Promise((r) => setTimeout(r, 0));
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	$: value, autoExpand();
</script>

<label class="flex flex-col w-full">
	<div class="text-sm">{label}</div>

	<textarea
		class="w-full h-auto px-2 py-1 overflow-hidden bg-gray-500 rounded bg-opacity-10"
		bind:value
		bind:this={textarea}
		{placeholder}
		on:input={(event) => {
			onInput(event);
			autoExpand();
		}}
	/>
</label>
