<!--
SPDX-FileCopyrightText: 2025 Forkbomb BV

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts" generics="T">
	import Icon from '@/components/ui-custom/icon.svelte';
	import Button from '@/components/ui-custom/button.svelte';
	import { getCollectionManagerContext } from '../collectionManagerContext';
	import { Head } from '@/components/ui/table';
	import type { KeyOf } from '@/utils/types';
	import { capitalize } from 'lodash';
	import { ArrowUp, ArrowDown } from 'lucide-svelte';

	interface Props {
		field: KeyOf<T>;
		label?: string | undefined;
	}

	let { field, label = undefined }: Props = $props();

	const { manager } = getCollectionManagerContext();

	const isSortField = $derived(manager.query.hasSort(field));
	const sort = $derived(manager.query.getSort(field));

	async function handleClick() {
		if (!isSortField) {
			manager.query.setSort(field, 'ASC');
		} else if (sort) {
			manager.query.flipSort(sort);
		}
	}
</script>

<Head class="group">
	<div class="flex items-center gap-x-2">
		{label ?? capitalize(field)}
		<Button
			size="icon"
			variant="ghost"
			class="{isSortField ? 'visible' : 'invisible'} size-6 group-hover:visible"
			onclick={handleClick}
		>
			<Icon
				src={!isSortField ? ArrowUp : sort?.[1] == 'DESC' ? ArrowDown : ArrowUp}
				size={14}
			/>
		</Button>
	</div>
</Head>
