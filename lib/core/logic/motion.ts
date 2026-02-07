/**
 * Lógica matemática pura (sin React / sin sensores).
 * Esta capa se usa tanto por adaptadores (hooks) como por UI.
 */
import type { Vector3D } from "../domain";
import { SHAKE_THRESHOLD } from "../logic/constants";

/** Magnitud euclidiana de un vector 3D. */
export const magnitude = (v: Vector3D) => Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);

/**
 * Determina si una lectura del acelerómetro cuenta como “shake”.
 * Usa `SHAKE_THRESHOLD` para evitar falsos positivos.
 */
export const isShaking = (data: Vector3D) => {
	const m = magnitude(data);
	return m > SHAKE_THRESHOLD;
};
