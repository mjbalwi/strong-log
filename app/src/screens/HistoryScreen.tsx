import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HistoryStackParamList } from "../navigation/types";
import { api, type Workout } from "../lib/api";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<HistoryStackParamList, "History">;

export default function HistoryScreen({ navigation }: Props) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useFocusEffect(
    useCallback(() => {
      api.listWorkouts().then(setWorkouts);
    }, [])
  );

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      data={workouts}
      keyExtractor={(w) => w.id}
      renderItem={({ item }) => (
        <Pressable
          style={styles.row}
          onPress={() => navigation.navigate("WorkoutDetail", { workoutId: item.id })}
        >
          <Text style={styles.date}>{new Date(item.startedAt).toLocaleDateString()}</Text>
          <Text style={styles.status}>{item.finishedAt ? "Completed" : "In progress"}</Text>
        </Pressable>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No workouts logged yet.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 10 },
  row: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
  },
  date: { fontSize: 16, fontWeight: "600", color: colors.textPrimary },
  status: { color: colors.textSecondary },
  empty: { textAlign: "center", marginTop: 40, color: colors.textSecondary },
});
