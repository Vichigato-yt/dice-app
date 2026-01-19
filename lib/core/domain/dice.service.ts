// Servicios de Dominio - Lógica de negocio pura
import { DiceFace, Rotation3D, Vector3D } from "./dice.types";

// Física 3D
export const Physics3D = {
	/**
	 * Aplica fricción a la velocidad
	 * @param velocity Velocidad actual
	 * @param friction Factor de fricción (0-1)
	 */
	applyFriction: (velocity: Vector3D, friction: number): Vector3D => ({
		x: velocity.x * friction,
		y: velocity.y * friction,
		z: velocity.z * friction,
	}),

	/**
	 * Interpola entre dos rotaciones (LERP)
	 * @param current Rotación actual
	 * @param target Rotación objetivo
	 * @param factor Factor de interpolación (0-1)
	 */
	lerpRotation: (
		current: Rotation3D,
		target: Rotation3D,
		factor: number
	): Rotation3D => ({
		x: current.x + (target.x - current.x) * factor,
		y: current.y + (target.y - current.y) * factor,
		z: current.z + (target.z - current.z) * factor,
	}),

	/**
	 * Calcula la magnitud de un vector
	 */
	magnitude: (v: Vector3D): number =>
		Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2),

	/**
	 * Suma dos vectores
	 */
	addVectors: (a: Vector3D, b: Vector3D): Vector3D => ({
		x: a.x + b.x,
		y: a.y + b.y,
		z: a.z + b.z,
	}),

	/**
	 * Multiplica un vector por un escalar
	 */
	scaleVector: (v: Vector3D, scalar: number): Vector3D => ({
		x: v.x * scalar,
		y: v.y * scalar,
		z: v.z * scalar,
	}),
};

// Lógica del Juego
export const DiceLogic = {
	/**
	 * Valida si un número es una cara de dado válida
	 */
	isValidFace: (value: unknown): value is DiceFace => {
		return typeof value === 'number' && value >= 1 && value <= 6;
	},

	/**
	 * Genera un número aleatorio de 1-6
	 */
	rollRandom: (): DiceFace => {
		const roll = Math.floor(Math.random() * 6) + 1;
		return roll as DiceFace;
	},

	/**
	 * Determina si la velocidad es negligible (cercana a cero)
	 */
	isVelocityNegligible: (velocity: Vector3D, threshold: number = 0.05): boolean => {
		return (
			Math.abs(velocity.x) < threshold &&
			Math.abs(velocity.y) < threshold &&
			Math.abs(velocity.z) < threshold
		);
	},
};
