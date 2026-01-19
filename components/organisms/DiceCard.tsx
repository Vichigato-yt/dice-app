import type { DiceFace, Vector3D } from "@/lib/core/domain";
import { Dice6 } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../atoms/Button";
import { Dice3D } from "./Dice3D";

type DiceCardProps = {
	value: DiceFace;
	isRolling: boolean;
	isIdle: boolean;
	onRoll: () => void;
	motionData: Vector3D | null;
};

export function DiceCard({ value, isRolling, isIdle, onRoll, motionData }: DiceCardProps) {
	return (
		<View style={styles.card}>
			<View style={styles.titleContainer}>
				<Dice6 size={32} color="#1a1a1a" strokeWidth={2.5} />
				<Text style={styles.title}>Magic Dice 3D</Text>
			</View>
			<View style={styles.diceContainer}>
				<Dice3D value={value} isRolling={isRolling} isIdle={isIdle} motionData={motionData} />
			</View>
			<Button onPress={onRoll} variant="primary">
				Lanzar Dado
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		width: "100%",
		backgroundColor: "#ffffff",
		gap: 20,
		alignItems: "center",
		justifyContent: "space-around",
		paddingVertical: 20,
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		color: "#1a1a1a",
	},
	diceContainer: {
		width: 300,
		height: 300,
		justifyContent: "center",
		alignItems: "center",
	},
});
