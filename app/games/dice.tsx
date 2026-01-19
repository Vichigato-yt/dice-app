// Pantalla del Juego - Presentación
import { Button } from "@/components/atoms/Button";
import { DiceCard } from "@/components/organisms/DiceCard";
import { DiceLogic, type DiceFace } from "@/lib/core/domain";
import { useAccelerometer } from "@/lib/modules/sensors/accelerometer";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function DiceScreen() {
	const router = useRouter();
	const [value, setValue] = useState<DiceFace>(1);
	const [isRolling, setIsRolling] = useState(false);
	const [isIdle, setIsIdle] = useState(true);
	const motionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleRoll = () => {
		setIsRolling(true);
		setIsIdle(false);
		const newFace = DiceLogic.rollRandom();
		setValue(newFace);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
	};

	const { data } = useAccelerometer({
		onShake: handleRoll,
	});

	// Detener rotación cuando no hay movimiento
	useEffect(() => {
		if (data && (Math.abs(data.x) > 0.1 || Math.abs(data.y) > 0.1 || Math.abs(data.z) > 0.1)) {
			setIsRolling(true);
			setIsIdle(false);
			
			// Limpiar timeouts anteriores
			if (motionTimeoutRef.current) clearTimeout(motionTimeoutRef.current);
			if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
			
			// Detener rotación 3 segundos después de que se estabilice
			motionTimeoutRef.current = setTimeout(() => {
				setIsRolling(false);
				
				// Mantener estático 2 segundos, luego volver a idle
				idleTimeoutRef.current = setTimeout(() => {
					setIsIdle(true);
				}, 2000);
			}, 3000);
		}

		return () => {
			if (motionTimeoutRef.current) clearTimeout(motionTimeoutRef.current);
			if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
		};
	}, [data]);

	return (
		<View style={styles.container}>
			<DiceCard 
				value={value} 
				isRolling={isRolling} 
				isIdle={isIdle}
				onRoll={handleRoll}
				motionData={data}
			/>

			<Button onPress={() => router.push("/")} variant="secondary">
				← Volver al Inicio
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
		justifyContent: "space-between",
		alignItems: "center",
		paddingBottom: 20,
	},
});
