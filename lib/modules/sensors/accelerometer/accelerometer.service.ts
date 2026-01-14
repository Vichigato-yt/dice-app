// Conexión Directa
import { ACCEL_UPDATE_INTERVAL_MS } from "@/lib/core/logic/constants";
import { Accelerometer } from "expo-sensors";

export type AccelerometerData = { x: number; y: number; z: number };

export const SensorService = {
	// Método para iniciar la escucha del hardware
	subscribe: (callback: (data: AccelerometerData) => void) => {
		Accelerometer.setUpdateInterval(ACCEL_UPDATE_INTERVAL_MS);
		return Accelerometer.addListener(callback);
	},

	// Limpieza para evitar memory leaks
	unsubscribe: (subscription: { remove: () => void } | null | undefined) => {
		if (subscription) subscription.remove();
	},
};
