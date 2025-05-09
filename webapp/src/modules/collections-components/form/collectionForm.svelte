<!--
SPDX-FileCopyrightText: 2025 Forkbomb BV

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts" generics="C extends CollectionName">
	import type { CollectionField } from 'pocketbase';
	import { capitalize } from '@/utils/other';
	import { getCollectionModel } from '@/pocketbase/collections-models';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import type { KeyOf } from '@/utils/types';
	import type { CollectionFormData } from '@/pocketbase/types';
	import { m } from '@/i18n';
	import { Form } from '@/forms';
	import { setupCollectionForm } from './collectionFormSetup';
	import CollectionFormField, {
		type CollectionFormFieldProps
	} from './collectionFormField.svelte';
	import {
		type CollectionFormMode,
		type CollectionFormProps,
		type FieldsOptions
	} from './collectionFormTypes';
	import { getCollectionFields } from '@/pocketbase/zod-schema';

	/* Props and unpacking */

	const props: CollectionFormProps<C> = $props();

	const {
		collection,
		fieldsOptions = {},
		uiOptions = {},
		submitButtonContent: buttonContent,
		submitButton: submitButtonArea
	} = $derived(props);

	const { hideRequiredIndicator = false } = $derived(uiOptions);

	type F = FieldsOptions<C>;

	const {
		order: fieldsOrder = [],
		exclude: excludeFields = [] as string[],
		hide = {} as F['hide'],
		labels = {} as F['labels'],
		descriptions = {} as F['descriptions'],
		placeholders = {} as F['placeholders'],
		snippets = {} as F['snippets'],
		relations = {} as F['relations']
	} = $derived(fieldsOptions);

	/* Form setup */

	const formMode = $derived<CollectionFormMode>(props.recordId ? 'edit' : 'create');

	const form = setupCollectionForm(props);
	// Note: form was previously derived, but this was causing issues with the form context
	// On error, the form would not be updated correctly

	/* Fields */

	const fieldsConfigs = $derived(
		getCollectionFields(collection)
			.sort(createFieldConfigSorter(fieldsOrder))
			.filter((config) => !excludeFields.includes(config.name))
	);

	function createFieldConfigSorter(order: string[] = []) {
		return (a: CollectionField, b: CollectionField) => {
			const aIndex = order.indexOf(a.name);
			const bIndex = order.indexOf(b.name);
			if (aIndex === -1 && bIndex === -1) {
				return 0;
			}
			if (aIndex === -1) {
				return 1;
			}
			if (bIndex === -1) {
				return -1;
			}
			return aIndex - bIndex;
		};
	}

	const fields = $derived<CollectionFormFieldProps<C>[]>(
		fieldsConfigs.map((fieldConfig) => {
			const name = fieldConfig.name as KeyOf<CollectionFormData[C]>;

			return {
				fieldConfig,
				hidden: Object.keys(hide).includes(name),
				label: labels[name] ?? capitalize(name),
				snippet: snippets[name],
				// @ts-expect-error - Slight type mismatch
				relationFieldOptions: relations[name],
				description: descriptions[name],
				placeholder: placeholders[name]
			};
		})
	);
</script>

<Form {form} {hideRequiredIndicator} submitButton={submitButtonArea}>
	{#each fields as field}
		<CollectionFormField {...field} />
	{/each}

	{#snippet submitButtonContent()}
		{#if buttonContent}
			{@render buttonContent()}
		{:else if formMode == 'edit'}
			{m.Edit_record()}
		{:else if formMode == 'create'}
			{m.Create_record()}
		{/if}
	{/snippet}
</Form>
