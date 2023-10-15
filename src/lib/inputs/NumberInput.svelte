<script lang="ts">
	export let label: string;
	export let value: number;
</script>

<div class="flex flex-row items-center h-10">
	<div class="w-[200px] text-sm mr-5">{label}</div>
	<input
		type="number"
		class="w-full h-full px-2 py-1 bg-gray-500 rounded bg-opacity-10"
		bind:value
		placeholder={label}
	/>
</div>
