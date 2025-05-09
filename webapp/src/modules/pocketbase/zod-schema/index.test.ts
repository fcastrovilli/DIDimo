// SPDX-FileCopyrightText: 2025 Forkbomb BV
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, it, expect } from 'vitest';
import { createCollectionZodSchema } from '.';
import type { CollectionFormData, Data } from '@/pocketbase/types';
import { getCollectionModel } from '@/pocketbase/collections-models';
import { subYears, addYears, differenceInMilliseconds, addMilliseconds } from 'date-fns';

//

type ZTestFormData = Data<CollectionFormData['z_test_collection']>;

describe('generated collection zod schema', () => {
	const schema = createCollectionZodSchema('z_test_collection');

	it('fails the validation for empty object ', () => {
		const parseResult = schema.safeParse({});
		expect(parseResult.success).toBe(false);
	});

	const baseData: ZTestFormData = {
		number_field: 3,
		relation_field: 'generic-id',
		text_field: 'sampletext',
		relation_multi_field: ['id-1', 'id-2'],
		richtext_field: '<div></div>',
		file_field: dummyFile()
	};

	it('passes the validation for typed object', () => {
		const parseResult = schema.safeParse(baseData);
		expect(parseResult.success).toBe(true);
	});

	it('fails the validation for file with bad mimeType', () => {
		const data: ZTestFormData = {
			...baseData,
			file_field: dummyFile('text/json')
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
		expect(parseResult.error?.issues.length).toBe(1);
		const parseErrorPath = parseResult.error?.issues.at(0)?.path.at(0);
		expect(parseErrorPath).toBe('file_field');
	});

	it('accepts empty string for optional url', () => {
		const data: ZTestFormData = {
			...baseData,
			url_field: ''
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(true);
	});

	it('doesn`t accept url with bad domain', () => {
		const data: ZTestFormData = {
			...baseData,
			url_field: 'https://miao.com'
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
		const parseErrorPath = parseResult.error?.issues.at(0)?.path.at(0);
		expect(parseErrorPath).toBe('url_field');
	});

	it('fails the regex test', () => {
		const data: ZTestFormData = {
			...baseData,
			text_with_regex: 'abc 123-24'
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
	});

	// JSON Field Checks

	const jsonField = getCollectionModel('z_test_collection').fields.find(
		(schemaField) => schemaField.type == 'json'
	);
	if (!jsonField) throw new Error('field not found');
	const { maxSize: jsonMaxSize } = jsonField;
	if (!jsonMaxSize) throw new Error('missing json max size');

	it('fails the json size check with a large JSON object', () => {
		const data: ZTestFormData = {
			...baseData,
			json_field: generateLargeJSONObject(jsonMaxSize * 1.5)
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
		const parseErrorPath = parseResult.error?.issues.at(0)?.path.at(0);
		expect(parseErrorPath).toBe('json_field');
	});

	it('passes the json size check with a small JSON object', () => {
		const jsonMaxSize = getCollectionModel('z_test_collection').fields[12].maxSize;
		const jsonObject = generateLargeJSONObject(jsonMaxSize * 0.5);
		const data: ZTestFormData = {
			...baseData,
			json_field: jsonObject
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(true);
	});

	// Date checks

	const dateField = getCollectionModel('z_test_collection').fields.find(
		(schemaField) => schemaField.type == 'date'
	);
	if (!dateField) throw new Error('field not found');
	const { max: maxDate, min: minDate } = dateField;
	if (!maxDate || !minDate) throw new Error('missing min and max date');

	it('fails the date check with a date earlier than minimum', () => {
		const earlierDate = subYears(minDate, 10);

		const data: ZTestFormData = {
			...baseData,
			date_field: earlierDate.toISOString()
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
	});

	it('fails the date check with a date later than maximum', () => {
		const laterDate = addYears(maxDate, 10);

		const data: ZTestFormData = {
			...baseData,
			date_field: laterDate.toISOString()
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
	});

	it('passes the date check with a date in between', () => {
		const difference = differenceInMilliseconds(maxDate, minDate);
		const betweenDate = addMilliseconds(minDate, difference / 2);

		console.log(minDate, betweenDate.toISOString(), maxDate);

		const data: ZTestFormData = {
			...baseData,
			date_field: betweenDate.toISOString()
		};
		const parseResult = schema.safeParse(data);
		console.log(parseResult.error?.issues);
		expect(parseResult.success).toBe(true);
	});
});

function dummyFile(mime = 'text/plain') {
	return new File(['Hello, World!'], 'hello.txt', {
		type: mime,
		lastModified: Date.now()
	});
}

function generateLargeJSONObject(size = 200000) {
	return {
		value: 'x'.repeat(Math.floor(size))
	};
}
