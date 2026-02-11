import {
    DICE_FACE_ROTATIONS,
    DiceFace,
    DiceState,
    DiceUseCases,
    Vector3D,
} from "@/lib/core/domain";
import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import type { Group } from "three";
import type { GLTF } from "three-stdlib";

type Dice3DProps = {
	value: DiceFace;
	isRolling: boolean;
	isIdle: boolean;
	motionData: Vector3D | null;
};

type DiceModelProps = Dice3DProps;

/**
 * Subcomponente interno que contiene el `group` de Three y aplica rotación/estado.
 * Se separa para mantener `Dice3D` (Canvas) simple y reutilizable.
 */
function DiceModel({ value, isRolling, isIdle, motionData }: DiceModelProps) {
	const groupRef = useRef<Group>(null);
	const idleRotationRef = useRef<number>(16);
	const stateRef = useRef<DiceState>({
		currentFace: value,
		isRolling: false,
		targetRotation: DICE_FACE_ROTATIONS[value],
		currentRotation: { x: 0, y: 0, z: 0 },
		velocity: { x: 0, y: 0, z: 0 },
	});
	const motionStopTimeRef = useRef<number | null>(null);

	// Cargar el modelo GLB (alias apunta a /assets)
	const glb = useGLTF(require("@assets/images/Dice.glb"));
	const scene = (glb as GLTF).scene;

	// Inicializar el objetivo con la rotación correcta
	useEffect(() => {
		stateRef.current = {
			...stateRef.current,
			currentFace: value,
			targetRotation: DICE_FACE_ROTATIONS[value],
		};
	}, [value]);

	useEffect(() => {
		if (motionData && isRolling) {
			// Aplicar movimiento del acelerómetro
			stateRef.current = DiceUseCases.applyMotion(stateRef.current, motionData);
			motionStopTimeRef.current = null;
		}

		// Cuando termina el rolling
		if (!isRolling && stateRef.current.isRolling) {
			stateRef.current = DiceUseCases.stopRoll(stateRef.current);
			motionStopTimeRef.current = Date.now();
		}

		// Después de 1 segundo sin movimiento, detener la tirada
		if (
			!isRolling &&
			motionStopTimeRef.current &&
			Date.now() - motionStopTimeRef.current > 1000
		) {
			motionStopTimeRef.current = null;
		}
	}, [motionData, isRolling]);

	useFrame((state, delta) => {
		if (!groupRef.current) return;

		if (isIdle) {
			// Rotación constante y muy notoria
			groupRef.current.rotation.x += delta * 8;
			groupRef.current.rotation.y += delta * 10;
			groupRef.current.rotation.z += delta * 6;
		} else if (isRolling) {
			// Rotación loca cuando se agita
			const amplifiedDelta = delta * 3; // Rota 3x más rápido
			stateRef.current = DiceUseCases.updateRotation(stateRef.current, amplifiedDelta);

			// Aplicar rotación al grupo
			groupRef.current.rotation.x = stateRef.current.currentRotation.x;
			groupRef.current.rotation.y = stateRef.current.currentRotation.y;
			groupRef.current.rotation.z = stateRef.current.currentRotation.z;
		} else {
			// Sin movimiento: mostrar cara final
			groupRef.current.rotation.x = stateRef.current.currentRotation.x;
			groupRef.current.rotation.y = stateRef.current.currentRotation.y;
			groupRef.current.rotation.z = stateRef.current.currentRotation.z;
		}
	});

	return (
		<group ref={groupRef}>
			<primitive object={scene} scale={1} />
		</group>
	);
}

function LoadingFallback() {
	return (
		<mesh>
			<boxGeometry args={[2, 2, 2]} />
			<meshStandardMaterial color="#cccccc" />
		</mesh>
	);
}

/**
 * Organism: Canvas 3D del dado.
 * Renderiza luces + modelo GLB y delega la animación de rotación a `DiceModel`.
 */
export function Dice3D({ value, isRolling, isIdle, motionData }: Dice3DProps) {
	return (
		<Canvas
			camera={{ position: [0, 0, 4], fov: 50 }}
			style={styles.container}
		>
			<ambientLight intensity={1} />
			<directionalLight position={[5, 5, 3]} intensity={1.5} />
			<directionalLight position={[-5, -5, -3]} intensity={0.8} />
			<pointLight position={[0, 3, 3]} intensity={0.8} />
			<Suspense fallback={<LoadingFallback />}>
				<DiceModel value={value} isRolling={isRolling} isIdle={isIdle} motionData={motionData} />
			</Suspense>
		</Canvas>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
	},
});
