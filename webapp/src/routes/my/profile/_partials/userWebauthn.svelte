<!--
SPDX-FileCopyrightText: 2025 Forkbomb BV

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import {
		registerUser,
		isWebauthnSupported,
		isPlatformAuthenticatorAvailable
	} from '@/webauthn';
	import { currentUser } from '@/pocketbase';
	import { CollectionManager, RecordDelete, RecordEdit } from '@/collections-components/manager';
	import T from '@/components/ui-custom/t.svelte';
	import { m } from '@/i18n';
	import Separator from '@/components/ui/separator/separator.svelte';
	import Button from '@/components/ui-custom/button.svelte';
	import Icon from '@/components/ui-custom/icon.svelte';
	import { Plus, Info } from 'lucide-svelte';
	import Card from '@/components/ui-custom/card.svelte';
	import Spinner from '@/components/ui-custom/spinner.svelte';
	import Alert from '@/components/ui-custom/alert.svelte';
	import type { WebauthnCredentialsResponse } from '@/pocketbase/types';

	const platformAuthenticatorAvailable = isPlatformAuthenticatorAvailable();
	const userEmailAddress = $currentUser?.email!;

	// ts helper

	function getCredentialId(record: WebauthnCredentialsResponse): string {
		// @ts-expect-error
		return record.credential.ID ?? '';
	}
</script>

<div class="space-y-4">
	<div class="space-y-1">
		<T tag="h4">{m.Your_devices()}</T>
		<T>{m.Manage_the_devices_you_use_to_login_()}</T>
	</div>

	<Separator></Separator>

	<CollectionManager
		collection="webauthnCredentials"
		editFormFieldsOptions={{ exclude: ['user', 'credential'] }}
	>
		{#snippet records({ records })}
			<div class="space-y-2 py-4">
				{#each records as record}
					{@const label = Boolean(record.description)
						? record.description
						: getCredentialId(record)}
					<Card>
						<div class="flex items-center justify-between gap-4">
							<div class="w-0 grow overflow-hidden">
								<T>{label}</T>
							</div>
							<div class="flex gap-2">
								<RecordEdit {record} />
								<RecordDelete {record} />
							</div>
						</div>
					</Card>
				{/each}
			</div>
		{/snippet}
	</CollectionManager>

	{#await platformAuthenticatorAvailable}
		<div class="flex flex-col items-center gap-2">
			<Spinner />
			<T>{m.Checking_your_device()}</T>
		</div>
	{:then response}
		{#if !response || !isWebauthnSupported()}
			<Alert variant="warning" icon={Info}>
				{#snippet content({ Description })}
					<Description>
						{m.Your_device_does_not_have_integrated_Webauthn_support_An_external_authenticator_is_required_()}
					</Description>
				{/snippet}
			</Alert>
		{/if}
	{/await}

	<div class="mt-2 flex justify-end">
		<Button
			variant="outline"
			onclick={() => {
				registerUser(userEmailAddress, navigator.userAgent);
			}}
		>
			<Icon src={Plus} mr />
			{m.Add_a_device()}
		</Button>
	</div>
</div>
