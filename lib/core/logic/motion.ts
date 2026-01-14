// Cálculos Vectoriales
import { SHAKE_THRESHOLD } from "../logic/constants";

export type Vector3 = { x: number; y: number; z: number };

export const magnitude = (v: Vector3) => Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);

export const isShaking = (data: Vector3) => {
	const m = magnitude(data);
	return m > SHAKE_THRESHOLD;
};
