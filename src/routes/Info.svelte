<section class="w-[400px] shadow shadow-black rounded p-5 flex flex-col gap-2 items-center">
	<h2 class="text-xl">About</h2>
	<!-- <p>A <span>rule / action</span> will be added whenever "enter" is pressed.</p> -->
	<p>Any unique character can be used as a <span>variable</span>.</p>
	<p>
		For <span>rules</span>, separate each with a <span>;</span> and use a
		<span>=</span>.
	</p>
	<p>
		For <span>actions</span>, separate each with a <span>;</span> and use a
		<span>=</span>, but have it as one of the possible <span>actions</span> below, with a
		<span>[]</span>
		around, separated by <span>,</span>
	</p>
	<p>The <span>angle</span> parameter is used in each iteration, for every "child" node.</p>
	<p>The <span>iteration count</span> is the depth of the recursion to take place.</p>
	<p>If unsure how things works, try out one of the <span>presets</span>.</p>
</section>

<style lang="postcss">
	span {
		color: rgb(59 130 246);
		font-weight: 700;
	}

	p {
		width: 100%;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
		background-color: rgb(243, 244, 246);
		border-radius: 0.25rem;
	}
</style>
