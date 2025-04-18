<!--
SPDX-FileCopyrightText: 2025 Forkbomb BV

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import * as Dialog from '@/components/ui/dialog/index.js';
	import { Footer } from '@/components/ui/dialog';
	import type { DialogRootProps } from 'bits-ui';
	import Separator from '@/components/ui/separator/separator.svelte';
	import type { Snippet } from 'svelte';
	import type { GenericRecord } from '@/utils/types';

	//

	type Props = DialogRootProps & {
		title?: string;
		description?: string;
		open?: boolean;
		class?: string;
		contentClass?: string;
		trigger?: Snippet<[{ props: GenericRecord; openDialog: () => void }]>;
		content?: Snippet<[{ Footer: typeof Footer; closeDialog: () => void }]>;
	};

	let {
		title,
		description,
		open = $bindable(false),
		class: className = '',
		contentClass = '',
		trigger,
		content,
		...rest
	}: Props = $props();

	function openDialog() {
		open = true;
	}

	function closeDialog() {
		open = false;
	}
</script>

<Dialog.Root bind:open {...rest}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			{@render trigger?.({ props, openDialog })}
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content class={contentClass}>
		{#if title || description}
			<Dialog.Header class="!text-left">
				{#if title}
					<Dialog.Title>{title}</Dialog.Title>
				{/if}
				{#if description}
					<Dialog.Description>
						{description}
					</Dialog.Description>
				{/if}
			</Dialog.Header>
			<Separator></Separator>
		{/if}

		{@render content?.({ Footer, closeDialog })}
	</Dialog.Content>
</Dialog.Root>
