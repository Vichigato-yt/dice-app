import type { DiceFace, Vector3D } from "@/lib/core/domain";
import { Dice6 } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../atoms/Button";
import { Dice3D } from "../organisms/Dice3D";

type DiceCardProps = {
	value: DiceFace;
	isRolling: boolean;
	isIdle?: boolean;
	onRoll: () => void;
	motionData?: Vector3D | null;
};

/**
 * Molecule que agrupa la UI del dado:
 * - Encabezado (icono + título)
 * - Render 3D del dado (organism `Dice3D`)
 * - Acción principal para lanzar el dado
 */
export function DiceCard({ value, isRolling, isIdle = false, onRoll, motionData }: DiceCardProps) {
	return (
		<View style={styles.card}>
			<View style={styles.titleContainer}>
				<Dice6 size={28} color="#1a1a1a" strokeWidth={2.5} />
				<Text style={styles.title}>Magic Dice 3D</Text>
			</View>
			<View style={styles.diceContainer}>
				<Dice3D value={value} isRolling={isRolling} isIdle={isIdle} motionData={motionData ?? null} />
			</View>
			<Button onPress={onRoll} variant="primary">
				Lanzar Dado
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#f8f8f8",
		borderRadius: 20,
		padding: 32,
		gap: 24,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 4,
		minWidth: 300,
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: "#1a1a1a",
	},
	diceContainer: {
		marginVertical: 16,
	},
});
