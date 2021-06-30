import { getDescriptor, isFillable } from "./element";
import { Rect } from "./types";

export function hasCommonAncestor(element: HTMLElement, other: HTMLElement, maxSiblingLevels = 3): boolean {
	const isDescendant = element.contains(other) || other.contains(element);
	if (isDescendant) return true;

	const ancestors = new Set([element]);

	let ancestor = element.parentElement;
	for (let i = 0; ancestor && i < maxSiblingLevels; i++) {
		ancestors.add(ancestor);
		ancestor = ancestor.parentElement;
	}

	let otherAncestor = other;
	for (let i = 0; otherAncestor && i < maxSiblingLevels + 1; i++) {
		if (ancestors.has(otherAncestor)) return true;

		otherAncestor = otherAncestor.parentElement!;
	}

	return false;
}

export function isElementMatch(element: HTMLElement, target: HTMLElement, cache: Map<HTMLElement, Rect>): boolean {
	if (element === target) return true;

	if (requireExactMatch(target)) return false;

	// check the middle of the element is within the target
	let targetRect = cache.get(target);
	if (!targetRect) {
		targetRect = target.getBoundingClientRect();
		cache.set(target, targetRect);
	}

	let elementRect = cache.get(element);
	if (!elementRect) {
		elementRect = element.getBoundingClientRect();
		cache.set(element, elementRect);
	}

	if (!isWithin(elementRect, targetRect)) return false;

	return false;
}

/**
 * Check the middle point of other is within the container.
 * Since that is what will be clicked on.
 */
export function isWithin(other: Rect, container: Rect): boolean {
	const middle = {
		x: other.x + other.width / 2,
		y: other.y + other.height / 2,
	};

	return container.x <= middle.x && middle.x <= container.x + container.width && container.y <= middle.y && middle.y <= container.y + container.height;
}

export function requireExactMatch(target: HTMLElement): boolean {
	// do not allow position match for iframes
	if (target.tagName === "IFRAME") return true;

	// do not allow position match if the element is fillable
	if (isFillable(getDescriptor(target))) return true;

	return false;
}
