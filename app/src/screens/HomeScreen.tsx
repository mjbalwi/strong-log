import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../navigation/types";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<HomeStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { signOut } = useAuth();
  const [starting, setStarting] = useState(false);

  const startWorkout = async () => {
    setStarting(true);
    try {
      const workout = await api.startWorkout();
      navigation.navigate("ActiveWorkout", { workoutId: workout.id });
    } catch (e) {
      // TODO: inline error
    } finally {
      setStarting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Strong Log</Text>
      <Pressable style={styles.button} disabled={starting} onPress={startWorkout}>
        <Text style={styles.buttonText}>{starting ? "Starting..." : "Start Workout"}</Text>
      </Pressable>
      <Pressable style={styles.signOut} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, gap: 16, backgroundColor: colors.background },
  title: { fontSize: 32, fontWeight: "700", textAlign: "center", marginBottom: 24, color: colors.textPrimary },
  button: { backgroundColor: colors.accent, borderRadius: 8, padding: 18, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  signOut: { position: "absolute", top: 60, right: 24 },
  signOutText: { color: colors.textMuted },
});
