import { combine } from './combine';
import { getCues } from './getCues';
import { requireExactMatch } from './isElementMatch';
import { Cue, CueSet } from './types';

type GenerateRelativeCueSets = {
	exactMatchOnly: boolean;
	level: number;
	relative: HTMLElement;
	targetCues: Cue[];
	// pass this instead of recalculating it
	twoTargetCueSets: Cue[][];
};

export function buildCueSet(cues: Cue[]): CueSet {
	const distance = Math.max(...cues.map((a) => Math.abs(a.level)));
	const penalty = cues.reduce((a, b) => a + b.penalty, 0);
	const valueLength = cues.reduce((a, b) => a + b.value.length, 0);

	// penalize cues by distance if further than 3 levels
	// otherwise it will try a bunch of invalid cues first
	// and run out of time before finding a match
	// if we penalize too much it will stop at a worse target selector
	const distanceFactor = 1 + Math.log(Math.max(distance - 3, 1));

	return {
		cues,
		penalty: penalty * distanceFactor,
		valueLength,
	};
}

export function compareCueSet(a: CueSet, b: CueSet): number {
	// sort by penalty
	const value = a.penalty - b.penalty;
	if (value !== 0) return value;

	// then by shortest value
	return a.valueLength - b.valueLength;
}

export function* generateCueSets(target: HTMLElement): Generator<CueSet, void, unknown> {
	// yield 1 target cue sets
	let targetCues = getCues(target, 0);

	yield* targetCues.map((cue) => buildCueSet([cue])) as any;

	// do not combine text cues because they are very expensive to evaluate
	targetCues = targetCues.filter((c) => c.type !== 'text');

	// yield 2 target cue sets
	const twoTargetCueSets = combine(targetCues, 2);
	yield* twoTargetCueSets.map(buildCueSet) as any;

	// yield 3 target cue sets
	const threeTargetCues = combine(targetCues, 3);
	yield* threeTargetCues.map(buildCueSet) as any;

	const exactMatchOnly = requireExactMatch(target);

	const descendants = target.querySelectorAll('*');
	let level = 1;
	let ancestor = target.parentElement;
	while (level - 1 < descendants.length || ancestor) {
		// yield ancestor + target cue sets
		if (ancestor) {
			// @ts-ignore
			yield* generateRelativeCueSets({
				exactMatchOnly,
				// negative so it is sorted higher when combined into a selector
				level: level * -1,
				relative: ancestor,
				targetCues,
				twoTargetCueSets,
			});
		}

		// yield target + descendant cue sets
		const descendant = descendants[level - 1] as HTMLElement;
		if (descendant) {
			// @ts-ignore
			yield* generateRelativeCueSets({
				exactMatchOnly,
				level,
				relative: descendant,
				targetCues,
				twoTargetCueSets,
			});
		}

		if (ancestor) ancestor = ancestor.parentElement;
		level += 1;
	}
}

export function* generateRelativeCueSets({
	exactMatchOnly,
	level,
	relative,
	targetCues,
	twoTargetCueSets,
}: GenerateRelativeCueSets): Generator<CueSet, void, unknown> {
	const relativeCues = getCues(relative, level);
	if (!relativeCues.length) return;

	// combine relative with target cues
	for (let i = 0; i < relativeCues.length; i++) {
		const relativeCue = relativeCues[i];

		// yield 1 relative cue
		yield buildCueSet([relativeCue]);

		// yield 1 relative and 1 target cue
		for (let j = 0; j < targetCues.length; j++) {
			yield buildCueSet([relativeCue, targetCues[j]]);
		}

		// yield 1 relative and 2 target cues
		for (let j = 0; j < twoTargetCueSets.length; j++) {
			yield buildCueSet([relativeCue, ...twoTargetCueSets[j]]);
		}
	}

	const twoRelativeCues = combine(relativeCues, 2);
	for (let i = 0; i < twoRelativeCues.length; i++) {
		if (!exactMatchOnly) {
			// yield 2 relative cues
			yield buildCueSet(twoRelativeCues[i]);
		}

		// combine 2 relative and 1 target cues
		for (let j = 0; j < targetCues.length; j++) {
			yield buildCueSet([...twoRelativeCues[i], targetCues[j]]);
		}
	}

	if (!exactMatchOnly) {
		// yield 3 relative cues
		const threeRelativeCues = combine(relativeCues, 3);
		for (let i = 0; i < threeRelativeCues.length; i++) {
			yield buildCueSet(threeRelativeCues[i]);
		}
	}
}

export function* generateSortedCueSets(
	target: HTMLElement,
	// 30 ms to generate 4000 cue sets on my machine
	timePerBatch = 30,
): Generator<CueSet, void, unknown> {
	let start = Date.now();

	const generator = generateCueSets(target);

	const yieldedHashes = new Set<string>();

	// collect the closest test attribute cue
	let testAttributeCue: Cue | null = null;

	function prepareBatch(): CueSet[] {
		const prepared: CueSet[] = [];

		batch
			// sort so we take the lower penalty duplicates first
			.sort(compareCueSet)
			.forEach((cueSet) => {
				// include the test attribute
				if (testAttributeCue && !cueSet.cues.some((c) => c.penalty === 0)) {
					cueSet.cues.unshift(testAttributeCue);
				}

				const hash = cueSet.cues
					.map((c) => c.value)
					.sort()
					.join(',');
				if (yieldedHashes.has(hash)) return;

				yieldedHashes.add(hash);
				prepared.push(cueSet);
			});

		batch = [];

		return prepared;
	}

	// batch then sort cues by penalty
	let batch: CueSet[] = [];
	// @ts-ignore
	for (const cueSet of generator) {
		// sometimes it yields undefined
		if (!cueSet) continue;

		batch.push(cueSet);

		// track the closest ancestor/target test attribute cue to always include
		// we don't always include descendant test attributes since those
		// could be across a click boundary
		cueSet.cues
			.filter((c: Cue) => c.penalty === 0 && c.level <= 0)
			.forEach((cue: Cue) => {
				if (!testAttributeCue || cue.level > testAttributeCue.level) {
					testAttributeCue = cue;
				}
			});

		if (timePerBatch > 0 && Date.now() - start >= timePerBatch) {
			const batchToYield = prepareBatch();
			yield* batchToYield as any;
			start = Date.now();
		}
	}

	if (batch.length) {
		const batchToYield = prepareBatch();
		yield* batchToYield as any;
	}
}
