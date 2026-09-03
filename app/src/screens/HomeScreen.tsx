import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { signOut } = useAuth();
  const [starting, setStarting] = useState(false);

  const startWorkout = async () => {
    setStarting(true);
    try {
      const workout = await api.startWorkout();
      navigation.navigate("ActiveWorkout", { workoutId: workout.id });
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "Could not start workout");
    } finally {
      setStarting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Strong Log</Text>
      <Pressable style={styles.button} disabled={starting} onPress={startWorkout}>
        <Text style={styles.buttonText}>Start Workout</Text>
      </Pressable>
      <Pressable style={styles.buttonSecondary} onPress={() => navigation.navigate("History")}>
        <Text style={styles.buttonSecondaryText}>View History</Text>
      </Pressable>
      <Pressable style={styles.signOut} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, gap: 16 },
  title: { fontSize: 32, fontWeight: "700", textAlign: "center", marginBottom: 24 },
  button: { backgroundColor: "#111", borderRadius: 8, padding: 18, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  buttonSecondary: { padding: 16, alignItems: "center" },
  buttonSecondaryText: { color: "#111", fontSize: 16 },
  signOut: { position: "absolute", top: 60, right: 24 },
  signOutText: { color: "#999" },
});
