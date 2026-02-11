import * as Accelerometer from "expo-sensors";
import type { Subscription } from "expo-sensors/build/Pedometer";
import type { Vector3D } from "../../../core/domain";
import { ACCEL_UPDATE_INTERVAL_MS } from "../../../core/logic/constants";

export type AccelerometerCallback = (data: Vector3D) => void;

/**
 * Servicio de bajo nivel que envuelve Expo Accelerometer.
 */
export const accelerometerService = {
	setUpdateInterval(ms: number = ACCEL_UPDATE_INTERVAL_MS) {
		Accelerometer.setUpdateInterval(ms);
	},
	subscribe(callback: AccelerometerCallback): Subscription {
		return Accelerometer.addListener(({ x, y, z }) => {
			callback({ x, y, z });
		});
	},
	unsubscribe(subscription?: Subscription) {
		subscription?.remove();
	},
};
