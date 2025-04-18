<!--
SPDX-FileCopyrightText: 2025 Forkbomb BV

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts" module>
	import type { SelectRootProps, SelectBaseRootPropsWithoutHTML } from 'bits-ui';
	import type { ArrayElement } from 'type-fest/source/internal';
	import type { ControlAttrs } from 'formsnap';
	import type { Snippet } from 'svelte';

	//

	export type SelectItem = ArrayElement<SelectBaseRootPropsWithoutHTML['items']>;
	export type SelectType = SelectRootProps['type'];
	export type SelectValue<T extends SelectType> = T extends 'multiple' ? string[] : string;

	export type SelectProps<
		T extends SelectType,
		V = SelectValue<T>
	> = SelectBaseRootPropsWithoutHTML & {
		clearOnSelect?: boolean;
		placeholder?: string;
		controlAttrs?: ControlAttrs;
		type: T;
		value?: V;
		trigger?: Snippet<[{ value: V | undefined }]>;
		onValueChange?: (value: V) => void;
	};
</script>

<script lang="ts" generics="T extends SelectType">
	import { ensureArray, maybeArrayIsValue } from '@/utils/other';

	import { m } from '@/i18n';
	import * as Select from '@/components/ui/select';

	//

	let {
		// @ts-ignore
		type = 'single' as SelectType,
		value = $bindable(),
		items,
		trigger,
		onValueChange,
		clearOnSelect = false,
		placeholder,
		controlAttrs,
		...rest
	}: SelectProps<T> = $props();

	// TODO - Fix types
	// - bind:value={value as undefined}
	// - onValueChange={(v: string | string[]) => {
	// - 	onValueChange?.(v as SelectValue<T>);
	// - 	if (clearOnSelect) value = undefined;
	// - }}
</script>

<Select.Root
	{type}
	{...rest}
	bind:value={value as undefined}
	onValueChange={(v: string | string[]) => {
		onValueChange?.(v as SelectValue<T>);
		if (clearOnSelect) value = undefined;
	}}
>
	<!-- Formsnap Fix -->
	<!-- Reference: https://formsnap.dev/docs/recipes/bits-ui-select -->
	{#if maybeArrayIsValue(value)}
		{#each ensureArray(value) as item}
			<input name={controlAttrs?.name ?? rest.name} hidden value={item} />
		{/each}
	{/if}
	<!-- Formsnap Fix -->

	<Select.Trigger {...controlAttrs}>
		{#if maybeArrayIsValue(value)}
			{#if trigger}
				{@render trigger({ value })}
			{:else}
				{value}
			{/if}
		{:else}
			{placeholder ?? m.Select_a_value()}
		{/if}
	</Select.Trigger>

	<Select.Content>
		{#if items?.length}
			{#each items as item}
				<Select.Item value={item.value} disabled={item.disabled}>
					{item.label ?? item.value}
				</Select.Item>
			{/each}
		{:else}
			<Select.Item class="flex justify-center [&>span]:hidden" disabled value="">
				{m.No_options_available()}
			</Select.Item>
		{/if}
	</Select.Content>
</Select.Root>
