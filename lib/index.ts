/**
 * Barrel exports de la librería.
 *
 * Este archivo es el punto de entrada de `@/lib` y re-exporta:
 * - Dominio (DDD)
 * - Lógica matemática/constantes (pura)
 * - Adaptadores de infraestructura (sensores)
 */
export * from "./core/domain";
export * from "./core/logic/constants";
export * from "./core/logic/motion";
export * from "./modules/sensors/accelerometer";

