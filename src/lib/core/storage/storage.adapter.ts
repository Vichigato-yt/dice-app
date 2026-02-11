import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Adaptador pequeño para encapsular AsyncStorage.
 * Permite reemplazarlo fácilmente (p.ej. MMKV) sin cambiar módulos.
 */
export const StorageAdapter = {
	async set<T>(key: string, value: T) {
		await AsyncStorage.setItem(key, JSON.stringify(value));
	},
	async get<T>(key: string): Promise<T | null> {
		const raw = await AsyncStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : null;
	},
	async remove(key: string) {
		await AsyncStorage.removeItem(key);
	},
};
