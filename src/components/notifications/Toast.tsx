import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

type ToastVariant = "info" | "success" | "error";

const VARIANT_STYLES: Record<ToastVariant, { background: string; text: string }> = {
	info: { background: "#1d1f2b", text: "#e0e7ff" },
	success: { background: "#0f2d25", text: "#6ee7b7" },
	error: { background: "#2a1214", text: "#fca5a5" },
};

type ToastProps = {
	message: string;
	visible: boolean;
	variant?: ToastVariant;
};

/**
 * Toast flotante simple para feedback rápido.
 */
export function Toast({ message, visible, variant = "info" }: ToastProps) {
	const opacity = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(10)).current;

	useEffect(() => {
		Animated.timing(opacity, {
			toValue: visible ? 1 : 0,
			duration: 180,
			easing: Easing.out(Easing.ease),
			useNativeDriver: true,
		}).start();

		Animated.spring(translateY, {
			toValue: visible ? 0 : 10,
			bounciness: 0,
			speed: 18,
			useNativeDriver: true,
		}).start();
	}, [opacity, translateY, visible]);

	const colors = VARIANT_STYLES[variant];

	return (
		<Animated.View
			pointerEvents="none"
			style={[
				styles.toast,
				{ backgroundColor: `${colors.background}CC` },
				{ opacity, transform: [{ translateY }] },
			]}
		>
			<View style={indicatorStyle(variant)} />
			<Text style={[styles.text, { color: colors.text }]}>{message}</Text>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	toast: {
		position: "absolute",
		left: 24,
		right: 24,
		bottom: 32,
		borderRadius: 16,
		paddingHorizontal: 20,
		paddingVertical: 14,
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		shadowColor: "#000",
		shadowOpacity: 0.3,
		shadowRadius: 16,
		shadowOffset: { width: 0, height: 10 },
		elevation: 6,
	},
	text: {
		flex: 1,
		fontSize: 15,
		fontWeight: "500",
	},
});

function indicatorStyle(variant: ToastVariant) {
	return {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor:
			variant === "success"
				? "#34d399"
				: variant === "error"
				? "#fb7185"
				: "#818cf8",
	};
}
