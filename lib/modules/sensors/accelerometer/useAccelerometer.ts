// Hook Adaptador
import type { Vector3D } from "@/lib/core/domain";
import { SHAKE_COOLDOWN_MS } from "@/lib/core/logic/constants";
import { isShaking } from "@/lib/core/logic/motion";
import { useEffect, useRef, useState } from "react";
import { AccelerometerData, SensorService } from "./accelerometer.service";

type UseAccelerometerOptions = {
	onShake?: () => void;
	cooldownMs?: number;
};

type UseAccelerometerReturn = {
	data: Vector3D | null;
	isShake: boolean;
};

export function useAccelerometer(options: UseAccelerometerOptions = {}): UseAccelerometerReturn {
	const { onShake, cooldownMs = SHAKE_COOLDOWN_MS } = options;
	const [data, setData] = useState<Vector3D | null>(null);
	const [isShake, setIsShake] = useState(false);
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
