// Pantalla Interactiva - Constructor de Hamburguesa
import { Button } from "@/components/atoms/Button";
import { Hamburger3D } from "@/components/organisms/Hamburger3D";
import {
    HAMBURGER_INGREDIENTS,
    type HamburgerIngredient,
    calculateHamburgerPrice,
} from "@/lib/core/domain/hamburger.types";
import { useRouter } from "expo-router";
import { ChevronDown, ChevronUp, Minus, Plus, ShoppingCart } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const INGREDIENTS_LIST: HamburgerIngredient[] = ["queso", "pepinillos", "lechuga", "carne"];

/**
 * Pantalla interactiva para construir una hamburguesa.
 * - Maneja el estado `selectedIngredients` (permite duplicados)
 * - Renderiza vista 3D en vivo via `Hamburger3D`
 * - Permite reordenar capas (up/down)
 * - Navega a checkout con params serializados
 */
export default function HamburgerBuilderScreen() {
	const router = useRouter();
	const [selectedIngredients, setSelectedIngredients] = useState<HamburgerIngredient[]>([]);

	// Precio total calculado en dominio (función pura).
	const totalPrice = calculateHamburgerPrice(selectedIngredients);
	// Capas = ingredientes + 2 panes.
	const layerCount = selectedIngredients.length + 2;

	// Ajusta el alto del canvas 3D para evitar que la hamburguesa “se aplaste”.
	const modelHeight = useMemo(() => {
		// Crece con cada ingrediente para no “aplastar” la vista.
		// Límite superior para evitar un canvas ridículamente grande.
		return Math.min(720, 280 + layerCount * 18);
	}, [layerCount]);

	/** Agrega 1 unidad del ingrediente al final (soporta duplicados). */
	const addIngredient = (ingredient: HamburgerIngredient) => {
		setSelectedIngredients((prev) => [...prev, ingredient]);
	};

	/**
	 * Quita 1 unidad del ingrediente (la última aparición) si existe.
	 * Esto permite tener cantidades grandes (p.ej. 30 carnes).
	 */
	const removeOneIngredient = (ingredient: HamburgerIngredient) => {
		setSelectedIngredients((prev) => {
			const index = prev.lastIndexOf(ingredient);
			if (index === -1) return prev;
			const next = [...prev];
			next.splice(index, 1);
			return next;
		});
	};

	/** Navega al checkout pasando ingredientes y total como params. */
	const handleBuy = () => {
		router.push({
			pathname: "./hamburger-checkout",
			params: {
				ingredients: JSON.stringify(selectedIngredients),
				totalPrice: totalPrice.toString(),
			},
		});
	};

	/** Mueve una capa de ingrediente dentro del array (reordenación visual). */
	const moveIngredientAt = (index: number, direction: "up" | "down") => {
		setSelectedIngredients((prev) => {
			const targetIndex = direction === "up" ? index - 1 : index + 1;
			if (targetIndex < 0 || targetIndex >= prev.length) return prev;
			const next = [...prev];
			const item = next[index];
			next.splice(index, 1);
			next.splice(targetIndex, 0, item);
			return next;
		});
	};

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.titleRow}>
						<ShoppingCart size={32} color="#1a1a1a" strokeWidth={2.5} />
						<Text style={styles.title}>Construir Hamburguesa</Text>
					</View>
					<Text style={styles.subtitle}>Añade ingredientes y personaliza tu hamburguesa</Text>
				</View>

				{/* Hamburguesa 3D */}
				<View style={[styles.modelContainer, { height: modelHeight }]}>
					<Hamburger3D selectedIngredients={selectedIngredients} layout="single" />
				</View>

				{/* Precio actual */}
				<View style={styles.priceCard}>
					<Text style={styles.priceLabel}>Precio Total:</Text>
					<Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
				</View>

				{/* Botones de ingredientes */}
				<View style={styles.ingredientsSection}>
					<Text style={styles.sectionTitle}>Ingredientes</Text>
					<View style={styles.ingredientsGrid}>
						{INGREDIENTS_LIST.map((ingredient) => {
							const config = HAMBURGER_INGREDIENTS[ingredient];
							const count = selectedIngredients.filter((i) => i === ingredient).length;
							const hasAny = count > 0;

							return (
								<Pressable
									key={ingredient}
									onPress={() => addIngredient(ingredient)}
									style={[
										styles.ingredientButton,
										hasAny && styles.ingredientButtonSelected,
									]}
								>
									<View style={styles.ingredientButtonContent}>
										<Text
											style={[
												styles.ingredientButtonText,
												hasAny && styles.ingredientButtonTextSelected,
											]}
										>
											{config.label}
										</Text>
										<Text
											style={[
												styles.ingredientPrice,
												hasAny && styles.ingredientPriceSelected,
											]}
										>
											+${config.price.toFixed(2)}
										</Text>
									</View>
									<View style={styles.ingredientControls}>
										<View style={[styles.countBadge, hasAny ? styles.countBadgeSelected : null]}>
											<Text style={[styles.countText, hasAny ? styles.countTextSelected : null]}>
												{count}
											</Text>
										</View>
										<Pressable
											onPress={() => removeOneIngredient(ingredient)}
											disabled={!hasAny}
											style={({ pressed }) => [
												styles.controlIconBtn,
												hasAny ? styles.controlIconBtnSelected : null,
												pressed ? styles.controlIconBtnPressed : null,
											]}
										>
											<Minus size={18} color={hasAny ? "#fff" : "#9ca3af"} strokeWidth={2.5} />
										</Pressable>
										<Pressable
											onPress={() => addIngredient(ingredient)}
											style={({ pressed }) => [
												styles.controlIconBtn,
												styles.controlIconBtnAdd,
												pressed ? styles.controlIconBtnPressed : null,
											]}
										>
											<Plus size={18} color="#1a1a1a" strokeWidth={2.5} />
										</Pressable>
									</View>
								</Pressable>
							);
						})}
					</View>
				</View>

				{/* Orden de ingredientes seleccionados */}
				{selectedIngredients.length > 0 && (
					<View style={styles.selectedIngredientsSection}>
						<Text style={styles.sectionTitle}>Tu Hamburguesa (orden):</Text>
						<View style={styles.selectedList}>
							<IngredientTag label="Pan Superior" color="#D4A574" />
							{selectedIngredients.map((ingredient, index) => {
								const config = HAMBURGER_INGREDIENTS[ingredient];
								const colorMap: Record<HamburgerIngredient, string> = {
									queso: "#FFD700",
									pepinillos: "#90EE90",
									lechuga: "#7CFC00",
									carne: "#8B4513",
								};
								return (
									<View key={`${ingredient}-${index}`} style={styles.orderedRow}>
										<IngredientTag label={config.label} color={colorMap[ingredient]} />
										<View style={styles.orderButtons}>
											<Pressable
												onPress={() => moveIngredientAt(index, "up")}
												disabled={index === 0}
												style={({ pressed }) => [styles.orderIconBtn, pressed && styles.orderIconBtnPressed]}
											>
												<ChevronUp size={18} color={index === 0 ? "#9ca3af" : "#1a1a1a"} strokeWidth={2.5} />
											</Pressable>
											<Pressable
												onPress={() => moveIngredientAt(index, "down")}
												disabled={index === selectedIngredients.length - 1}
												style={({ pressed }) => [styles.orderIconBtn, pressed && styles.orderIconBtnPressed]}
											>
												<ChevronDown
													size={18}
													color={index === selectedIngredients.length - 1 ? "#9ca3af" : "#1a1a1a"}
													strokeWidth={2.5}
												/>
											</Pressable>
										</View>
									</View>
								);
							})}
							<IngredientTag label="Pan Inferior" color="#D4A574" />
						</View>
					</View>
				)}

				{/* Botones de acción */}
				<View style={styles.actionButtons}>
					<Button onPress={handleBuy} variant="primary">
						Comprar - ${totalPrice.toFixed(2)}
					</Button>
					<Button onPress={() => router.push("/")} variant="secondary">
						← Volver
					</Button>
				</View>
			</View>
		</ScrollView>
	);
}

function IngredientTag({ label, color }: { label: string; color: string }) {
	// Badge visual para representar una capa en el listado de orden.
	return (
		<View style={[styles.ingredientTag, { backgroundColor: color }]}>
			<Text style={styles.ingredientTagText}>{label}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		backgroundColor: "#ffffff",
	},
	container: {
		padding: 20,
		gap: 16,
		alignItems: "center",
	},
	header: {
		alignItems: "center",
		gap: 8,
		paddingTop: 12,
		width: "100%",
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: "#1a1a1a",
	},
	subtitle: {
		fontSize: 14,
		color: "#6b7280",
		textAlign: "center",
	},
	modelContainer: {
		width: "100%",
		height: 300,
		backgroundColor: "#f8f8f8",
		borderRadius: 20,
		overflow: "hidden",
		borderWidth: 2,
		borderColor: "#e5e5e5",
	},
	priceCard: {
		width: "100%",
		backgroundColor: "#f0f0f0",
		borderRadius: 16,
		padding: 16,
		alignItems: "center",
		gap: 8,
		borderWidth: 2,
		borderColor: "#1a1a1a",
	},
	priceLabel: {
		fontSize: 14,
		color: "#6b7280",
		fontWeight: "500",
	},
	priceValue: {
		fontSize: 32,
		fontWeight: "700",
		color: "#1a1a1a",
	},
	ingredientsSection: {
		width: "100%",
		gap: 12,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1a1a1a",
	},
	ingredientsGrid: {
		gap: 12,
		width: "100%",
	},
	ingredientButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 14,
		backgroundColor: "#f8f8f8",
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#e5e5e5",
	},
	ingredientButtonSelected: {
		backgroundColor: "#1a1a1a",
		borderColor: "#1a1a1a",
	},
	ingredientButtonContent: {
		flex: 1,
		gap: 4,
	},
	ingredientButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1a1a1a",
	},
	ingredientButtonTextSelected: {
		color: "#fff",
	},
	ingredientPrice: {
		fontSize: 12,
		color: "#6b7280",
		fontWeight: "500",
	},
	ingredientPriceSelected: {
		color: "#d1d5db",
	},
	ingredientControls: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginLeft: 12,
	},
	countBadge: {
		minWidth: 30,
		height: 26,
		paddingHorizontal: 8,
		borderRadius: 13,
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#e5e5e5",
		alignItems: "center",
		justifyContent: "center",
	},
	countBadgeSelected: {
		backgroundColor: "#1a1a1a",
		borderColor: "#1a1a1a",
	},
	countText: {
		fontSize: 12,
		fontWeight: "700",
		color: "#1a1a1a",
	},
	countTextSelected: {
		color: "#ffffff",
	},
	controlIconBtn: {
		width: 34,
		height: 34,
		borderRadius: 10,
		backgroundColor: "#1a1a1a",
		borderWidth: 1,
		borderColor: "#1a1a1a",
		alignItems: "center",
		justifyContent: "center",
	},
	controlIconBtnAdd: {
		backgroundColor: "#ffffff",
		borderColor: "#e5e5e5",
	},
	controlIconBtnSelected: {
		backgroundColor: "#1a1a1a",
		borderColor: "#1a1a1a",
	},
	controlIconBtnPressed: {
		opacity: 0.75,
		transform: [{ scale: 0.98 }],
	},
	selectedIngredientsSection: {
		width: "100%",
		gap: 12,
	},
	orderedRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 12,
	},
	orderButtons: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	orderIconBtn: {
		width: 34,
		height: 34,
		borderRadius: 10,
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#e5e5e5",
		alignItems: "center",
		justifyContent: "center",
	},
	orderIconBtnPressed: {
		opacity: 0.7,
		transform: [{ scale: 0.98 }],
	},
	selectedList: {
		flexDirection: "column",
		width: "100%",
		gap: 10,
	},
	ingredientTag: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		marginBottom: 4,
	},
	ingredientTagText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#1a1a1a",
	},
	actionButtons: {
		width: "100%",
		gap: 12,
		alignItems: "center",
		paddingTop: 8,
		paddingBottom: 20,
	},
});
