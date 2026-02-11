import type { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "./auth.service";

type AuthContextType = {
	session: Session | null;
	loading: boolean;
	signInWithEmail: (email: string, password: string) => Promise<void>;
	signUpWithEmail: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
	session: null,
	loading: true,
	signInWithEmail: async () => {},
	signUpWithEmail: async () => {},
	signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		authService.getSession().then(({ data: { session } }) => {
			setSession(session);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = authService.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signInWithEmail = (email: string, password: string) =>
		authService.signInWithEmail(email, password);

	const signUpWithEmail = (email: string, password: string) =>
		authService.signUpWithEmail(email, password);

	const signOut = () => authService.signOut();

	return (
		<AuthContext.Provider value={{ session, loading, signInWithEmail, signUpWithEmail, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};
