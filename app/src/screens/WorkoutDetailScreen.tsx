import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HistoryStackParamList } from "../navigation/types";
import { api, type WorkoutDetail } from "../lib/api";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<HistoryStackParamList, "WorkoutDetail">;

export default function WorkoutDetailScreen({ route }: Props) {
  const { workoutId } = route.params;
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);

  useEffect(() => {
    api.getWorkout(workoutId).then(setWorkout);
  }, [workoutId]);

  if (!workout) return null;

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Text style={styles.date}>{new Date(workout.startedAt).toLocaleString()}</Text>
      {workout.exercises.map((exercise) => (
        <View key={exercise.id} style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {exercise.sets.map((set, i) => (
            <Text key={set.id} style={styles.setRow}>
              Set {i + 1}: {set.weight} lb x {set.reps}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  date: { fontSize: 16, color: colors.textSecondary, marginBottom: 8 },
  exerciseCard: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 16, gap: 4, backgroundColor: colors.surface },
  exerciseName: { fontSize: 18, fontWeight: "700", marginBottom: 4, color: colors.textPrimary },
  setRow: { fontSize: 16, color: colors.textSecondary },
});
