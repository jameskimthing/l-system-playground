import type { LSystemAction } from './l-systems';

interface Preset {
	[key: string]: {
		axiom: string;
		rules: { [key: string]: string };
		actions: { [key: string]: LSystemAction[] };
		defaults: {
			angle: number;
			iterationCount: number;
			length: number;
		};
	};
}

const presets: Preset = {
	binary_tree: {
		axiom: '0',
		rules: {
			'1': '11',
			'0': '1[0]0'
		},
		actions: {
			'0': ['draw'],
			'1': ['draw'],
			'[': ['push', 'left'],
			']': ['pop', 'right']
		},
		defaults: {
			angle: 45,
			iterationCount: 7,
			length: 3
		}
	},
	koch_curve: {
		axiom: 'F',
		rules: {
			F: 'F+F-F-F+F'
		},
		actions: {
			F: ['draw'],
			'+': ['left'],
			'-': ['right']
		},
		defaults: {
			angle: 90,
			iterationCount: 3,
			length: 5
		}
	},
	sierpinski_triangle: {
		axiom: 'F-G-G',
		rules: {
			F: 'F-G+F+G-F',
			G: 'GG'
		},
		actions: {
			F: ['draw'],
			G: ['draw'],
			'+': ['left'],
			'-': ['right']
		},
		defaults: {
			angle: 120,
			iterationCount: 4,
			length: 20
		}
	},
	dragon_curve: {
		axiom: 'F',
		rules: {
			F: 'F+G',
			G: 'F-G'
		},
		actions: {
			F: ['draw'],
			G: ['draw'],
			'+': ['left'],
			'-': ['right']
		},
		defaults: {
			angle: 90,
			iterationCount: 8,
			length: 16
		}
	},
	fractal_plant: {
		axiom: 'X',
		rules: {
			X: 'F+[[X]-X]-F[-FX]+X',
			F: 'FF'
		},
		actions: {
			F: ['draw'],
			'+': ['left'],
			'-': ['right'],
			// X: [],
			'[': ['push'],
			']': ['pop']
		},
		defaults: {
			angle: 25,
			iterationCount: 4,
			length: 17
		}
	}
};

export { presets };
