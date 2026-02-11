import { useAuth } from '@/lib/modules/auth/AuthProvider';
import { useRouter } from 'expo-router';
import { Dices, LogOut, Sandwich } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MenuScreen() {
  const { session, signOut } = useAuth();
  const router = useRouter();

  const userEmail = session?.user?.email ?? 'Invitado';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola!</Text>
        <Text style={styles.email}>{userEmail}</Text>
      </View>

      <Text style={styles.sectionTitle}>¿Qué quieres jugar?</Text>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push('/games/dice')}
      >
        <View style={styles.cardIcon}>
          <Dices size={36} color="#bd93f9" strokeWidth={1.5} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Lanzar Dado</Text>
          <Text style={styles.cardDescription}>
            Agita el teléfono o toca para lanzar
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push('/games/hamburger-builder')}
      >
        <View style={styles.cardIcon}>
          <Sandwich size={36} color="#bd93f9" strokeWidth={1.5} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Construir Hamburguesa</Text>
          <Text style={styles.cardDescription}>
            Arma tu hamburguesa capa por capa
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={async () => {
          await signOut();
          router.replace('/');
        }}
        activeOpacity={0.7}
      >
        <LogOut size={18} color="#ff5555" strokeWidth={2} />
        <Text style={styles.signOutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#bd93f9',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2a2a4a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 13,
    color: '#999',
  },
  signOutButton: {
    marginTop: 'auto',
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  signOutText: {
    color: '#ff5555',
    fontSize: 15,
    fontWeight: '500',
  },
});
