/**
 * Hook adaptador (infraestructura → dominio).
 *
 * - Se suscribe a `SensorService` (expo-sensors)
 * - Convierte datos a `Vector3D` (dominio)
 * - Aplica `isShaking()` (lógica pura)
 * - Dispara `onShake()` con cooldown para no spamear eventos
 */
import type { Vector3D } from "@/lib/core/domain";
import { SHAKE_COOLDOWN_MS } from "@/lib/core/logic/constants";
import { isShaking } from "@/lib/core/logic/motion";
import { useEffect, useRef, useState } from "react";
import { AccelerometerData, SensorService } from "./accelerometer.service";

type UseAccelerometerOptions = {
	/** Callback opcional que se ejecuta cuando se detecta un shake válido. */
	onShake?: () => void;
	/** Cooldown configurable (ms) entre shakes detectados. */
	cooldownMs?: number;
};

type UseAccelerometerReturn = {
	/** Última lectura del acelerómetro en formato de dominio. */
	data: Vector3D | null;
	/** Flag derivada (true cuando la lectura actual supera el threshold). */
	isShake: boolean;
};

/**
 * Devuelve lecturas del acelerómetro y si el dispositivo está “agitando”.
 * La UI puede usar `data` para animación y `isShake` para feedback.
 */
export function useAccelerometer(options: UseAccelerometerOptions = {}): UseAccelerometerReturn {
	const { onShake, cooldownMs = SHAKE_COOLDOWN_MS } = options;
	const [data, setData] = useState<Vector3D | null>(null);
	const [isShake, setIsShake] = useState(false);
	// Último timestamp de shake confirmado (para aplicar cooldown).
	const lastShakeRef = useRef<number>(0);

	useEffect(() => {
		const sub = SensorService.subscribe((d: AccelerometerData) => {
			const sample: Vector3D = { x: d.x ?? 0, y: d.y ?? 0, z: d.z ?? 0 };
			setData(sample);
			const shakeNow = isShaking(sample);
			setIsShake(shakeNow);

			if (shakeNow) {
				const now = Date.now();
				if (now - lastShakeRef.current > cooldownMs) {
					lastShakeRef.current = now;
					onShake?.();
				}
			}
		});

		return () => SensorService.unsubscribe(sub);
	}, [onShake, cooldownMs]);

	return { data, isShake };
}
