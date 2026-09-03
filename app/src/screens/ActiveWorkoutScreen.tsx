import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { api, type ExerciseLog } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "ActiveWorkout">;

export default function ActiveWorkoutScreen({ route, navigation }: Props) {
  const { workoutId } = route.params;
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const workout = await api.getWorkout(workoutId);
    setExercises(workout.exercises);
  }, [workoutId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addExercise = async () => {
    if (!newExerciseName.trim()) return;
    const exercise = await api.addExercise(workoutId, newExerciseName.trim(), exercises.length);
    setNewExerciseName("");
    setActiveExerciseId(exercise.id);
    await refresh();
  };

  const logSet = async (exerciseId: string) => {
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    if (Number.isNaN(w) || Number.isNaN(r)) {
      Alert.alert("Enter weight and reps");
      return;
    }
    const exercise = exercises.find((e) => e.id === exerciseId);
    const orderIndex = exercise?.sets.length ?? 0;
    await api.addSet(exerciseId, w, r, orderIndex);
    setWeight("");
    setReps("");
    await refresh();
  };

  const finish = async () => {
    await api.finishWorkout(workoutId);
    navigation.replace("Home");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <Pressable
              onPress={() =>
                setActiveExerciseId(activeExerciseId === exercise.id ? null : exercise.id)
              }
            >
              <Text style={styles.exerciseName}>{exercise.name}</Text>
            </Pressable>

            {exercise.sets.map((set, i) => (
              <Text key={set.id} style={styles.setRow}>
                Set {i + 1}: {set.weight} lb x {set.reps}
              </Text>
            ))}

            {activeExerciseId === exercise.id && (
              <View style={styles.logRow}>
                <TextInput
                  style={styles.numberInput}
                  placeholder="Weight"
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                />
                <TextInput
                  style={styles.numberInput}
                  placeholder="Reps"
                  keyboardType="number-pad"
                  value={reps}
                  onChangeText={setReps}
                />
                <Pressable style={styles.logButton} onPress={() => logSet(exercise.id)}>
                  <Text style={styles.logButtonText}>Log Set</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}

        <View style={styles.addExerciseRow}>
          <TextInput
            style={styles.input}
            placeholder="Exercise name (e.g. Squat)"
            value={newExerciseName}
            onChangeText={setNewExerciseName}
            onSubmitEditing={addExercise}
          />
          <Pressable style={styles.addButton} onPress={addExercise}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

        <Pressable style={styles.finishButton} onPress={finish}>
          <Text style={styles.finishButtonText}>Finish Workout</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16, paddingBottom: 48 },
  exerciseCard: {
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 10,
    padding: 16,
    gap: 6,
  },
  exerciseName: { fontSize: 20, fontWeight: "700" },
  setRow: { fontSize: 16, color: "#333" },
  logRow: { flexDirection: "row", gap: 8, marginTop: 10, alignItems: "center" },
  numberInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    width: 80,
    textAlign: "center",
  },
  logButton: { backgroundColor: "#111", borderRadius: 8, padding: 12, flex: 1, alignItems: "center" },
  logButtonText: { color: "#fff", fontWeight: "600" },
  addExerciseRow: { flexDirection: "row", gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 14, fontSize: 16 },
  addButton: { backgroundColor: "#eee", borderRadius: 8, padding: 14, justifyContent: "center" },
  addButtonText: { fontWeight: "600" },
  finishButton: { backgroundColor: "#0a7d32", borderRadius: 8, padding: 18, alignItems: "center" },
  finishButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
