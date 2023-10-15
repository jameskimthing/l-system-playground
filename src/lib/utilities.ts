import { possibleActions, type LSystemAction } from './l-systems';

function showIf(condition: boolean, text: string): string {
	if (condition) return text;
	else return '';
}

function trim(text: string): string {
	return text.replace(/\s+/g, '');
}

function parseRules(rules: string): any {
	const parsedRules: { [key: string]: string } = {};
	try {
		for (let rule of rules.split(';')) {
			rule = trim(rule);

			if (!rule) continue;
			if (rule === '\n') continue;
			if ((rule.match(/=/g) || []).length != 1)
				return [parsedRules, 'Problem with =. Did you miss a ";" or a "="?'];

			const [key, value] = rule.split('=');

			if (!key) return [parseRules, `Key missing for value ${value}`];
			if (!value) return [parsedRules, `Value missing for key ${key}`];
			parsedRules[trim(key)] = trim(value);
		}
	} catch (_) {
		return [parsedRules, _];
	}
	return [parsedRules, ''];
}

function parseActions(actions: string): any {
	const parsedActions: { [key: string]: LSystemAction[] } = {};
	try {
		for (let action of actions.split(';')) {
			action = trim(action);

			if (!action) continue;
			if (action === '\n') continue;
			if ((action.match(/=/g) || []).length != 1)
				return [parsedActions, 'Problem with =. Did you miss a ; or a =?'];

			const [key, value] = action.split('=');

			let va = trim(value);
			if (!va.startsWith('[') || !va.endsWith(']'))
				return [parsedActions, 'invalid brackets with []'];
			va = va.slice(1, -1);
			const valueActions: LSystemAction[] = va.split(',') as any;

			for (const a of valueActions) {
				if (!possibleActions.has(a)) return [parsedActions, `uknown value ${a}`];
			}

			parsedActions[key] = valueActions;
		}
	} catch (_) {
		return [parsedActions, _];
	}
	return [parsedActions, ''];
}

function rulesToString(rules: { [key: string]: string }): string {
	let rulesString: string = '';
	for (const [key, value] of Object.entries(rules)) rulesString += `${key}=${value};\n`;
	return rulesString.trim();
}

function actionsToString(actions: { [key: string]: LSystemAction[] }): string {
	let actionsString: string = '';
	for (const [key, values] of Object.entries(actions)) {
		actionsString += `${key}=[`;
		actionsString += values.join(',');
		actionsString += `];\n`;
	}
	return actionsString.trim();
}

function splitAndCapitalize(text: string): string {
	return text
		.split('_')
		.map((string) => string.charAt(0).toUpperCase() + string.slice(1))
		.join(' ');
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export {
	showIf,
	parseRules,
	parseActions,
	rulesToString,
	actionsToString,
	splitAndCapitalize,
	clamp
};
