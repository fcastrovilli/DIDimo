<!--
SPDX-FileCopyrightText: 2025 Forkbomb BV

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
	import type { DropdownMenuItemProps } from 'bits-ui';
	import Icon from './icon.svelte';
	import type { IconComponent, LinkWithIcon } from '../types';
	import type { Snippet } from 'svelte';
	import { localizeHref } from '@/i18n';

	//

	type Props = Omit<LinkWithIcon, 'title'> & {
		title?: string;
		href: string;
		icon?: IconComponent;
		options?: DropdownMenuItemProps;
		children?: Snippet;
	};

	const { title, icon, href, options, children, ...rest }: Props = $props();
	$inspect(icon);
</script>

<DropdownMenuItem {...options} class="{options?.class} hover:cursor-pointer">
	{#snippet child({ props })}
		<a
			href={href ? localizeHref(href) : undefined}
			{...props}
			{...rest}
			data-sveltekit-preload-data="off"
		>
			{#if children}
				{@render children()}
			{:else if title}
				{#if icon}
					<Icon src={icon} />
				{/if}
				<span>{title}</span>
			{/if}
		</a>
	{/snippet}
</DropdownMenuItem>
