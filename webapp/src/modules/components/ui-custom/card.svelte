<!--
SPDX-FileCopyrightText: 2025 Forkbomb BV

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { Root, Content, Header, Footer } from '@/components/ui/card';
	import type { ComponentProps, Snippet } from 'svelte';

	type Props = ComponentProps<typeof Root> & {
		contentClass?: string;
		header?: Snippet;
		children?: Snippet;
		footer?: Snippet;
	};

	const { contentClass, header, children, footer, ...rest }: Props = $props();
</script>

<Root {...rest}>
	{#if header}
		<Header>
			{@render header()}
		</Header>
	{/if}

	<Content class={contentClass}>
		{@render children?.()}
	</Content>

	{#if footer}
		<Footer>
			{@render footer()}
		</Footer>
	{/if}
</Root>
