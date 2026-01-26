import { useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo } from "react";
import { Box3, Vector3 } from "three";
import type { Mesh, Object3D } from "three";
import type { GLTF } from "three-stdlib";
import { SkeletonUtils } from "three-stdlib";

export type HamburgerLayerConfig = {
	id: string;
	label: string;
	modelAsset: any;
	scale?: number;
};

function normalizeSceneForBetterShading(root: Object3D) {
	root.traverse((obj) => {
		const maybeMesh = obj as Mesh;
		if (!maybeMesh.isMesh) return;

		maybeMesh.castShadow = true;
		maybeMesh.receiveShadow = true;

		try {
			maybeMesh.geometry?.computeVertexNormals?.();
		} catch {
			// No-op
		}

		const material: any = maybeMesh.material;
		if (material) {
			material.flatShading = false;
			material.needsUpdate = true;
		}
	});
}

function recenterSceneXZ(root: Object3D) {
	// Muchos GLB vienen con pivot corrido (p.ej. pepinillos).
	// Esto centra el contenido en el eje X/Z sin tocar Y.
	const box = new Box3().setFromObject(root);
	if (!Number.isFinite(box.min.x) || !Number.isFinite(box.max.x)) return;
	const center = new Vector3();
	box.getCenter(center);
	root.position.x -= center.x;
	root.position.z -= center.z;
}

export function HamburgerModel({ modelAsset, scale = 1.0 }: Pick<HamburgerLayerConfig, "modelAsset" | "scale">) {
	const glb = useGLTF(modelAsset);
	const scene = (glb as GLTF).scene;
	const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

	useEffect(() => {
		normalizeSceneForBetterShading(cloned);
		recenterSceneXZ(cloned);
	}, [cloned]);

	return <primitive object={cloned} scale={scale} />;
}
