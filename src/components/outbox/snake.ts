/**
 * Pure game engine for the activity-heatmap snake easter egg.
 *
 * The board mirrors the visible heatmap grid: `cols` × `rows` cells on a
 * torus, so the snake wraps at every edge. Food squares are the cells that
 * hold posts; what eating one *means* (filtering the post list) is decided
 * by the DOM layer. Nothing here touches the DOM — the game is a plain
 * state object advanced by `step`, deterministic and testable in isolation.
 */

export type Direction = 'up' | 'down' | 'left' | 'right';

export type SnakeStatus = 'playing' | 'crashed' | 'won';

export interface Point {
	x: number;
	y: number;
}

export interface StepResult {
	status: SnakeStatus;
	/** Key of the food cell consumed on this tick, if any. */
	ate: string | null;
}

export interface SnakeState {
	readonly cols: number;
	readonly rows: number;
	/** Remaining food cells, keyed via {@link cellKey}. */
	readonly food: Set<string>;
	status: SnakeStatus;
	/** Body cells, head first. */
	snake: Point[];
	/** Body cells one tick ago, kept so renderers can interpolate. */
	previous: Point[];
	/** Direction of travel, updated from `turns` each tick. */
	direction: Direction;
	/** Buffered direction changes, oldest first. */
	turns: Direction[];
}

const VECTORS: Record<Direction, Point> = {
	up: { x: 0, y: -1 },
	down: { x: 0, y: 1 },
	left: { x: -1, y: 0 },
	right: { x: 1, y: 0 },
};

const OPPOSITES: Record<Direction, Direction> = {
	up: 'down',
	down: 'up',
	left: 'right',
	right: 'left',
};

const START_LENGTH = 3;

/**
 * Turns buffered between ticks. Two lets quick double-taps (e.g. up then
 * left to U-turn around an obstacle) register naturally instead of the
 * second press being swallowed.
 */
const TURN_BUFFER = 2;

/** Canonical key for a board cell, shared with the DOM layer. */
export const cellKey = (x: number, y: number): string =>
	`${String(x)},${String(y)}`;

export function createGame(
	cols: number,
	rows: number,
	food: Iterable<string>,
): SnakeState {
	const foodSet = new Set(food);
	const snake = spawn(cols, rows, foodSet);
	return {
		cols,
		rows,
		food: foodSet,
		status: 'playing',
		snake,
		previous: [...snake],
		direction: 'right',
		turns: [],
	};
}

/**
 * Queue a direction change for upcoming ticks. Reversals and repeats of
 * the latest effective direction are ignored.
 */
export function turn(game: SnakeState, direction: Direction): void {
	const reference = game.turns.at(-1) ?? game.direction;
	if (direction === reference || direction === OPPOSITES[reference]) return;
	if (game.turns.length < TURN_BUFFER) game.turns.push(direction);
}

/** Advance the game by one tick. */
export function step(game: SnakeState): StepResult {
	if (game.status !== 'playing') return { status: game.status, ate: null };

	game.direction = game.turns.shift() ?? game.direction;
	game.previous = [...game.snake];

	const head = game.snake[0];
	const vector = VECTORS[game.direction];
	const next = {
		x: (head.x + vector.x + game.cols) % game.cols,
		y: (head.y + vector.y + game.rows) % game.rows,
	};
	const nextKey = cellKey(next.x, next.y);
	const grows = game.food.has(nextKey);

	// The tail cell vacates on the same tick (unless the snake grows),
	// so moving into it is legal.
	const blocking = grows ? game.snake : game.snake.slice(0, -1);
	if (blocking.some((p) => p.x === next.x && p.y === next.y)) {
		game.status = 'crashed';
		return { status: game.status, ate: null };
	}

	game.snake = grows
		? [next, ...game.snake]
		: [next, ...game.snake.slice(0, -1)];
	if (grows) {
		game.food.delete(nextKey);
		if (game.food.size === 0) game.status = 'won';
	}
	return { status: game.status, ate: grows ? nextKey : null };
}

/**
 * Pick a starting body: heading right, roughly a third of the way in,
 * on the row closest to the middle that doesn't cover any food.
 */
function spawn(cols: number, rows: number, food: ReadonlySet<string>): Point[] {
	const length = Math.min(START_LENGTH, Math.max(1, cols - 1));
	const headX = Math.min(
		cols - 1,
		Math.max(length - 1, Math.floor(cols / 3)),
	);
	const middle = Math.floor(rows / 2);
	const bodyAt = (y: number): Point[] =>
		Array.from({ length }, (_, i) => ({
			x: (headX - i + cols) % cols,
			y,
		}));

	const rowsByDistance = Array.from({ length: rows }, (_, y) => y).sort(
		(a, b) => Math.abs(a - middle) - Math.abs(b - middle),
	);
	for (const y of rowsByDistance) {
		const body = bodyAt(y);
		if (body.every((p) => !food.has(cellKey(p.x, p.y)))) return body;
	}
	return bodyAt(middle);
}

/**
 * Interpolated body positions for rendering at a fractional tick.
 *
 * Each cell is lerped from its previous to its current position along the
 * shortest torus path, then unwrapped so consecutive points are never split
 * across a seam — every point is shifted by whole board sizes to sit beside
 * its predecessor. The polyline may therefore extend past the board edges;
 * renderers draw translated copies to cover the wrap-around.
 */
export function snakePolyline(game: SnakeState, alpha: number): Point[] {
	const { snake, previous, cols, rows } = game;
	const points: Point[] = [];
	for (let i = 0; i < snake.length; i++) {
		// A newly grown tail cell has no own history; it holds still.
		const from = previous[Math.min(i, previous.length - 1)];
		const to = snake[i];
		const x = from.x + shortestDelta(from.x, to.x, cols) * alpha;
		const y = from.y + shortestDelta(from.y, to.y, rows) * alpha;
		if (i === 0) {
			points.push({ x, y });
			continue;
		}
		const anchor = points[i - 1];
		points.push({
			x: x + Math.round((anchor.x - x) / cols) * cols,
			y: y + Math.round((anchor.y - y) / rows) * rows,
		});
	}
	return points;
}

/**
 * Signed distance from `from` to `to` along the shortest path around a ring
 * of `size` cells.
 */
function shortestDelta(from: number, to: number, size: number): number {
	const direct = (to - from) % size;
	if (direct > size / 2) return direct - size;
	if (direct < -size / 2) return direct + size;
	return direct;
}
