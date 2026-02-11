import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../../core/supabase/client.supabase";

type AuthClient = SupabaseClient;

const client: AuthClient = supabase;

async function ensureProfile(userId: string, email: string | undefined | null) {
	const { error } = await client.from("profiles").insert([
		{
			id: userId,
			email,
			first_name: "Usuario",
			last_name: "Nuevo",
		},
	]);

	if (error) {
		console.error("Error creando perfil:", error);
	}
}

export const authService = {
	getSession: () => client.auth.getSession(),
	onAuthStateChange: (callback: Parameters<AuthClient["auth"]["onAuthStateChange"]>[0]) =>
		client.auth.onAuthStateChange(callback),
	signInWithEmail: async (email: string, password: string) => {
		const { error } = await client.auth.signInWithPassword({ email, password });
		if (error) throw error;
	},
	signUpWithEmail: async (email: string, password: string) => {
		const { data, error } = await client.auth.signUp({ email, password });
		if (error) throw error;

		if (data.user) {
			await ensureProfile(data.user.id, data.user.email);
		}
	},
	signOut: async () => {
		const { error } = await client.auth.signOut();
		if (error) throw error;
	},
};

export type AuthSession = Session | null;
