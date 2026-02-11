import { Stage } from "@react-three/drei";
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

export function HamburgerLayerCanvas({
	layer,
	dpr,
}: {
	layer: HamburgerLayerConfig;
	dpr: number;
}) {
	// Renderiza una sola capa en un “card canvas”.
	// Usamos `Stage` para iluminación/cámara automática por modelo.
	return (
		<View style={styles.card}>
			<View style={styles.canvasWrap}>
				<Canvas
					dpr={[1, dpr]}
					frameloop="demand"
					shadows
					gl={{ antialias: true, powerPreference: "high-performance" }}
					camera={{ position: [0.9, 0.55, 4.2], fov: 38, near: 0.1, far: 60 }}
					style={styles.canvas}
				>
					<color attach="background" args={["#f8f8f8"]} />
					<Suspense fallback={<LoadingFallback />}>
						<Stage
							preset="rembrandt"
							intensity={1.15}
							environment="city"
							shadows={{ type: "contact", opacity: 0.4, blur: 2.5 }}
							adjustCamera
						>
							<group position={[0, -0.15, 0]}>
								<HamburgerModel modelAsset={layer.modelAsset} scale={layer.scale} />
							</group>
						</Stage>
					</Suspense>
				</Canvas>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		borderRadius: 16,
		overflow: "hidden",
		borderWidth: 2,
		borderColor: "#e5e5e5",
		backgroundColor: "#f8f8f8",
	},
	canvasWrap: {
		width: "100%",
		height: 220,
		backgroundColor: "#f8f8f8",
	},
	canvas: {
		width: "100%",
		flex: 1,
	},
});
