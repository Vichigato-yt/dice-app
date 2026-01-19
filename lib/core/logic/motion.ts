// Cálculos Vectoriales
import type { Vector3D } from "../domain";
import { SHAKE_THRESHOLD } from "../logic/constants";

export const magnitude = (v: Vector3D) => Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);

export const isShaking = (data: Vector3D) => {
	const m = magnitude(data);
	return m > SHAKE_THRESHOLD;
};
