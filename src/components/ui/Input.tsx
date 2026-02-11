import type { TextInputProps } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

type InputProps = TextInputProps & {
	label?: string;
	error?: string;
};

/**
 * Campo de texto base utilizado por pantallas de auth o formularios simples.
 */
export function Input({ label, error, style, ...props }: InputProps) {
	return (
		<View style={styles.container}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			<TextInput
				placeholderTextColor="#6b7280"
				style={[styles.input, error ? styles.inputError : undefined, style]}
				{...props}
			/>
			{error ? <Text style={styles.error}>{error}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		gap: 6,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#f8f8f8",
	},
	input: {
		width: "100%",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#27272a",
		backgroundColor: "rgba(15,15,15,0.65)",
		color: "#f8f8f8",
		fontSize: 16,
	},
	inputError: {
		borderColor: "#f87171",
	},
	error: {
		fontSize: 12,
		color: "#f87171",
	},
});
