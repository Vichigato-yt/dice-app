// Dominio - Entidades y tipos base del juego
export type DiceFace = 1 | 2 | 3 | 4 | 5 | 6;

export type Vector3D = {
	readonly x: number;
	readonly y: number;
	readonly z: number;
};

export type Rotation3D = {
	readonly x: number;
	readonly y: number;
	readonly z: number;
};

export type DiceState = {
	readonly currentFace: DiceFace;
	readonly isRolling: boolean;
	readonly targetRotation: Rotation3D;
	readonly currentRotation: Rotation3D;
	readonly velocity: Vector3D;
};

export type DiceGameEvent = 
	| { type: 'ROLL_STARTED'; face: DiceFace }
	| { type: 'ROLL_ENDED'; face: DiceFace }
	| { type: 'MOTION_UPDATE'; data: Vector3D };

// Mapeo de caras del dado a rotaciones (en radianes)
export const DICE_FACE_ROTATIONS: Record<DiceFace, Rotation3D> = {
	1: { x: 0, y: 0, z: 0 }, // Frente
	2: { x: 0, y: Math.PI / 2, z: 0 }, // Derecha
	3: { x: -Math.PI / 2, y: 0, z: 0 }, // Arriba
	4: { x: Math.PI / 2, y: 0, z: 0 }, // Abajo
	5: { x: 0, y: -Math.PI / 2, z: 0 }, // Izquierda
	6: { x: 0, y: Math.PI, z: 0 }, // Atrás
};
