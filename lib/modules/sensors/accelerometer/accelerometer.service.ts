/**
 * Infraestructura: wrapper de `expo-sensors`.
 *
 * Objetivo: aislar el acceso al hardware en un solo lugar.
 */
import { ACCEL_UPDATE_INTERVAL_MS } from "@/lib/core/logic/constants";
import { Accelerometer } from "expo-sensors";

/**
 * Forma de datos que entrega `expo-sensors`.
 * Se transforma a `Vector3D` más arriba (en el hook adaptador).
 */
export type AccelerometerData = { x: number; y: number; z: number };

export const SensorService = {
	/** Suscribe al acelerómetro y retorna la subscription (para limpiar luego). */
	subscribe: (callback: (data: AccelerometerData) => void) => {
		Accelerometer.setUpdateInterval(ACCEL_UPDATE_INTERVAL_MS);
		return Accelerometer.addListener(callback);
	},

	/**
	 * Limpieza de la subscription.
	 * Importante para evitar memory leaks al desmontar pantallas.
	 */
	unsubscribe: (subscription: { remove: () => void } | null | undefined) => {
		if (subscription) subscription.remove();
	},
};
