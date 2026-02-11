import { useEffect, useMemo, useRef, useState } from "react";
import type { Vector3D } from "../../../core/domain";
import { SHAKE_COOLDOWN_MS } from "../../../core/logic/constants";
import { magnitude } from "../../../core/logic/motion";
import { accelerometerService } from "./accelerometer.service";

export type UseAccelerometerResult = {
	data: Vector3D | null;
	isShaking: boolean;
};

/**
 * Hook que expone lecturas del acelerómetro + detección de “shake”.
 */
export function useAccelerometer(): UseAccelerometerResult {
	const [data, setData] = useState<Vector3D | null>(null);
	const [isShaking, setIsShaking] = useState(false);
	const lastShakeRef = useRef<number>(0);

	const listener = useMemo(() => {
		return (nextData: Vector3D) => {
			setData(nextData);

			const now = Date.now();
			const isAboveThreshold = magnitude(nextData) > 2.0;
			const canShakeAgain = now - lastShakeRef.current > SHAKE_COOLDOWN_MS;

			if (isAboveThreshold && canShakeAgain) {
				setIsShaking(true);
				lastShakeRef.current = now;
			} else if (!isAboveThreshold) {
				setIsShaking(false);
			}
		};
	}, []);

	useEffect(() => {
		accelerometerService.setUpdateInterval();
		const subscription = accelerometerService.subscribe(listener);
		return () => accelerometerService.unsubscribe(subscription);
	}, [listener]);

	return { data, isShaking };
}
