// Casos de Uso
import { DiceLogic, Physics3D } from "./dice.service";
import { DICE_FACE_ROTATIONS, DiceFace, DiceState, Rotation3D, Vector3D } from "./dice.types";

export const DiceUseCases = {
	/**
	 * Inicia una tirada de dado
	 */
	startRoll: (currentState: DiceState): { state: DiceState; face: DiceFace } => {
		const face = DiceLogic.rollRandom();
		return {
			face,
			state: {
				...currentState,
				currentFace: face,
				isRolling: true,
				targetRotation: DICE_FACE_ROTATIONS[face],
				velocity: { x: 0, y: 0, z: 0 },
			},
		};
	},

	/**
	 * Aplica movimiento del acelerómetro a la velocidad
	 */
	applyMotion: (
		state: DiceState,
		motionData: Vector3D,
		sensitivity: number = 15
	): DiceState => {
		if (!state.isRolling) return state;

		const motionScaled = Physics3D.scaleVector(motionData, sensitivity);
		const newVelocity: Vector3D = {
			x: state.velocity.x + motionScaled.y, // Y del dispositivo -> X rotación
			y: state.velocity.y + motionScaled.x, // X del dispositivo -> Y rotación
			z: state.velocity.z + motionScaled.z,
		};

		return { ...state, velocity: newVelocity };
	},

	/**
	 * Actualiza la posición del dado según la física
	 */
	updateRotation: (
		state: DiceState,
		deltaTime: number,
		friction: number = 0.70
	): DiceState => {
		if (!state.isRolling && !DiceLogic.isVelocityNegligible(state.velocity)) {
			return state;
		}

		// Aplicar rotación
		const newRotation: Rotation3D = {
			x: state.currentRotation.x + state.velocity.x * deltaTime,
			y: state.currentRotation.y + state.velocity.y * deltaTime,
			z: state.currentRotation.z + state.velocity.z * deltaTime,
		};

		// Aplicar fricción
		const newVelocity = Physics3D.applyFriction(state.velocity, friction);

		// Si no hay velocidad significativa, interpolar hacia la rotación objetivo
		if (
			!state.isRolling &&
			DiceLogic.isVelocityNegligible(newVelocity)
		) {
			const lerpFactor = 1.5 * deltaTime;
			const smoothRotation = Physics3D.lerpRotation(
				newRotation,
				state.targetRotation,
				lerpFactor
			);

			return {
				...state,
				currentRotation: smoothRotation,
				velocity: { x: 0, y: 0, z: 0 },
			};
		}

		return {
			...state,
			currentRotation: newRotation,
			velocity: newVelocity,
		};
	},

	/**
	 * Detiene el rolling
	 */
	stopRoll: (state: DiceState): DiceState => ({
		...state,
		isRolling: false,
	}),
};
