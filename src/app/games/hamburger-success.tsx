// Pantalla de Éxito - Compra Confirmada
import { Button } from "@/components/ui";
import { NotificationAdapter } from "@/lib/core/notifications/notification.adapter";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

/**
 * Pantalla de confirmación.
 * Muestra total e items, con una animación de escala para feedback visual.
 */
export default function HamburgerSuccessScreen() {
	const router = useRouter();
	const params = useLocalSearchParams<{ totalPrice?: string; itemCount?: string }>();

	const totalPrice = params.totalPrice ? parseFloat(params.totalPrice) : 0;
	const itemCount = params.itemCount ? parseInt(params.itemCount) : 0;

	const scaleAnim = React.useRef(new Animated.Value(0)).current;
	const notificationSent = useRef(false);

	useEffect(() => {
		// Animación de entrada (spring) para el icono.
		Animated.spring(scaleAnim, {
			toValue: 1,
			tension: 40,
			friction: 7,
			useNativeDriver: true,
		}).start();

		// Guard: solo enviar notificaciones una vez por montaje
		if (notificationSent.current) return;
		notificationSent.current = true;

		// Notificación inmediata: compra realizada con éxito
		NotificationAdapter.scheduleLocalNotification({
			title: 'Compra realizada con éxito',
			body: `Tu orden de $${totalPrice.toFixed(2)} ha sido confirmada. Estamos preparando tu hamburguesa.`,
			data: { url: '/games/hamburger-success' },
		});

		// Notificación a los 20 segundos: pedido listo
		NotificationAdapter.scheduleLocalNotification({
			title: 'Tu pedido está listo',
			body: 'Tu hamburguesa ya está lista para recoger. Buen provecho!',
			data: { url: '/games/hamburger-success' },
			seconds: 20,
		});
	}, []);

	return (
		<View style={styles.container}>
			{/* Ícono animado */}
			<Animated.View
				style={[
					styles.iconContainer,
					{
						transform: [{ scale: scaleAnim }],
					},
				]}
			>
				<CheckCircle size={100} color="#bd93f9" strokeWidth={1.5} />
			</Animated.View>

			{/* Título */}
			<Text style={styles.title}>¡Compra Confirmada!</Text>
			<Text style={styles.subtitle}>Tu hamburguesa está siendo preparada</Text>

			{/* Detalles de la orden */}
			<View style={styles.detailsCard}>
				<DetailItem label="Items en tu orden" value={itemCount.toString()} />
				<View style={styles.divider} />
				<DetailItem label="Total pagado" value={`$${totalPrice.toFixed(2)}`} highlight />
			</View>

			{/* Botones de acción */}
			<View style={styles.actionButtons}>
				<Button onPress={() => router.push("./hamburger-builder")} variant="primary">
					Hacer otra Hamburguesa
				</Button>
				<Button onPress={() => router.push("/")} variant="secondary">
					← Ir al Inicio
				</Button>
			</View>
		</View>
	);
}

function DetailItem({
	label,
	value,
	highlight = false,
}: {
	label: string;
	value: string;
	highlight?: boolean;
}) {
	// Fila label/value, con opción de resaltar el valor (p.ej. total pagado).
	return (
		<View style={styles.detailRow}>
			<Text style={styles.detailLabel}>{label}</Text>
			<Text style={[styles.detailValue, highlight && styles.detailValueHighlight]}>
				{value}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0f0f0f",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
		gap: 24,
	},
	iconContainer: {
		marginBottom: 12,
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		color: "#ffffff",
		textAlign: "center",
	},
	subtitle: {
		fontSize: 16,
		color: "#888",
		textAlign: "center",
	},
	detailsCard: {
		width: "100%",
		backgroundColor: "#1a1a2e",
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: "#2a2a4a",
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
	},
	detailLabel: {
		fontSize: 14,
		color: "#888",
		fontWeight: "500",
	},
	detailValue: {
		fontSize: 16,
		fontWeight: "600",
		color: "#ffffff",
	},
	detailValueHighlight: {
		fontSize: 18,
		fontWeight: "700",
		color: "#bd93f9",
	},
	divider: {
		height: 1,
		backgroundColor: "#2a2a4a",
	},
	actionButtons: {
		width: "100%",
		gap: 12,
		alignItems: "center",
		paddingBottom: 20,
	},
});
