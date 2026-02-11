import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { StyleSheet, View } from "react-native";
import { HamburgerModel, type HamburgerLayerConfig } from "./HamburgerModel";

/** Placeholder simple mientras carga el GLB (Suspense). */
function LoadingFallback() {
	return (
		<mesh castShadow receiveShadow>
			<boxGeometry args={[1, 0.2, 1]} />
			<meshStandardMaterial color="#d1d5db" roughness={0.8} metalness={0.0} />
		</mesh>
	);
}
/** Limita un valor dentro de [min, max]. */
function clamp(min: number, value: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

/**
 * Calcula posiciones Y “exploded” para apilar capas.
 * Reduce ligeramente el espaciado cuando hay muchas capas para evitar una torre infinita.
 */
function computeExplodedPositions(layerCount: number) {
	// A más capas, reducimos ligeramente el espaciado para que no quede absurdamente alta,
	// y a la vez alejamos la cámara (ver abajo).
	const extra = Math.max(0, layerCount - 6);
	const spacing = clamp(0.28, 0.55 - extra * 0.01, 0.55);
	const mid = (layerCount - 1) / 2;
	return Array.from({ length: layerCount }, (_, i) => (mid - i) * spacing);
}

export function HamburgerSingleCanvas({
	layers,
	dpr,
}: {
	layers: HamburgerLayerConfig[];
	dpr: number;
}) {
	// Posiciones verticales (Y) de cada capa.
	const positionsY = computeExplodedPositions(layers.length);
	const minY = Math.min(...positionsY);
	const maxY = Math.max(...positionsY);

	// Altura total aproximada para ajustar la cámara en base a la “torre” real.
	const heightSpan = Math.max(1, maxY - minY) + 1.2; // padding
	// Cámara se aleja/sube según altura de capas.
	const cameraZ = 4.8 + heightSpan * 1.25;
	const cameraY = 0.9 + heightSpan * 0.28;
	const far = Math.max(80, cameraZ + 80);

	return (
		<View style={styles.container}>
			<Canvas
				dpr={[1, dpr]}
				frameloop="demand"
				shadows
				gl={{ antialias: true, powerPreference: "high-performance" }}
				camera={{ position: [0, cameraY, cameraZ], fov: 32, near: 0.1, far }}
				style={styles.canvas}
			>
				<color attach="background" args={["#f8f8f8"]} />
				<ambientLight intensity={0.75} />
				<directionalLight
					position={[6, 8, 6]}
					intensity={2.2}
					castShadow
					shadow-mapSize-width={2048}
					shadow-mapSize-height={2048}
				/>
				<directionalLight position={[-6, 4, -4]} intensity={1.1} />
				<pointLight position={[0, 3, 3]} intensity={0.55} />

				<Suspense fallback={<LoadingFallback />}>
					{layers.map((layer, index) => (
						// Cada capa se renderiza en un group con su posición Y.
						<group key={layer.id} position={[0, positionsY[index] ?? 0, 0]}>
							<HamburgerModel modelAsset={layer.modelAsset} scale={layer.scale} />
						</group>
					))}
				</Suspense>
			</Canvas>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		backgroundColor: "#f8f8f8",
	},
	canvas: {
		width: "100%",
		flex: 1,
	},
});
