import { Debugger } from "electron";

class MouseImpl {
	cdp: Debugger;

	constructor(webContentsDebugger: Debugger) {
		this.cdp = webContentsDebugger;
	}

	compensateHalfIntegerRoundingError(point) {
		const remainderX = point.x - Math.floor(point.x);
		if (remainderX > 0.49 && remainderX < 0.51) point.x -= 0.02;
		const remainderY = point.y - Math.floor(point.y);
		if (remainderY > 0.49 && remainderY < 0.51) point.y -= 0.02;
	}

	intersectQuadWithViewport(quad, metrics) {
		return quad.map((point) => ({
			x: Math.min(Math.max(point.x, 0), metrics.width),
			y: Math.min(Math.max(point.y, 0), metrics.height),
		}));
	}

	async _getBoundingBox() {
		return { x: 0, y: 0 };
	}

	computeQuadArea(quad) {
		// Compute sum of all directed areas of adjacent triangles
		// https://en.wikipedia.org/wiki/Polygon#Simple_polygons
		let area = 0;
		for (let i = 0; i < quad.length; ++i) {
			const p1 = quad[i];
			const p2 = quad[(i + 1) % quad.length];
			area += (p1.x * p2.y - p2.x * p1.y) / 2;
		}
		return Math.abs(area);
	}

	async getContentQuads(nodeObjectId: string): Promise<Array<{ x: number; y: number }>> {
		const quadResponse = await this.cdp.sendCommand("DOM.getContentQuads", { objectId: nodeObjectId });
		const position = await this._getBoundingBox();

		return quadResponse.quads.map((quad) => [
			{ x: quad[0] + position.x, y: quad[1] + position.y },
			{ x: quad[2] + position.x, y: quad[3] + position.y },
			{ x: quad[4] + position.x, y: quad[5] + position.y },
			{ x: quad[6] + position.x, y: quad[7] + position.y },
		]);
	}

	async getClickablePoint(nodeObjectId: string) {
		const metricsResult = await this.cdp.sendCommand("Runtime.callFunctionOn", {
			functionDeclaration: "function(){ console.log(this); return JSON.stringify({width: innerWidth, height: innerHeight }) }",
			objectId: nodeObjectId,
		});

		const metrics = JSON.parse(metricsResult.result.value);
		const quads = await this.getContentQuads(nodeObjectId);

		if (!quads || !quads.length) return "error:notvisible";

		// Allow 1x1 elements. Compensate for rounding errors by comparing with 0.99 instead.
		const filtered = quads.map((quad) => this.intersectQuadWithViewport(quad, metrics)).filter((quad) => this.computeQuadArea(quad) > 0.99);
		if (!filtered.length) return "error:notinviewport";
		// Return the middle point of the first quad.
		const result = { x: 0, y: 0 };
		for (const point of filtered[0]) {
			result.x += point.x / 4;
			result.y += point.y / 4;
		}
		this.compensateHalfIntegerRoundingError(result);
		return result;
	}

	async mouseUp(point) {
		await this.cdp.sendCommand("Input.dispatchMouseEvent", {
			type: "mouseReleased",
			x: point.x,
			y: point.y,
			clickCount: 1,
			button: "left",
		});

		return true;
	}

	async mouseDown(point) {
		await this.cdp.sendCommand("Input.dispatchMouseEvent", {
			type: "mousePressed",
			x: point.x,
			y: point.y,
			clickCount: 1,
			button: "left",
		});

		return true;
	}

	async mouseOver(point) {
		await this.cdp.sendCommand("Input.dispatchMouseEvent", {
			type: "mouseMoved",
			x: point.x,
			y: point.y,
			button: "none",
		});

		return true;
	}

	async click(nodeObjectId: string) {
		const clickablePoint = await this.getClickablePoint(nodeObjectId);
		if (clickablePoint === "error:notvisible") return false;
		if (clickablePoint === "error:notinviewport") return false;

		await this.mouseOver(clickablePoint);
		await this.mouseDown(clickablePoint);
		await this.mouseUp(clickablePoint);
		return true;
	}

	async hover(nodeObjectId: string) {
		const clickablePoint = await this.getClickablePoint(nodeObjectId);
		console.log("Clickable point", clickablePoint);
		if (clickablePoint === "error:notvisible") return false;
		if (clickablePoint === "error:notinviewport") return false;

		await this.mouseOver(clickablePoint);
		return true;
	}
}

export { MouseImpl };
