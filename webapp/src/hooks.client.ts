// SPDX-FileCopyrightText: 2025 Forkbomb BV
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { currentUser, pb, type AuthStoreModel } from '@/pocketbase';

import { version } from '$app/environment';
import { appName } from '@/brand';

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.model as AuthStoreModel);
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false, secure: false });
});

console.info(`${appName} version: 🔖 ${version}`);
