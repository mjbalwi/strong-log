import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { api, type Workout } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "History">;

export default function HistoryScreen({ navigation }: Props) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    api.listWorkouts().then(setWorkouts);
  }, []);

  return (
    <FlatList
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
    borderColor: "#e2e2e2",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: { fontSize: 16, fontWeight: "600" },
  status: { color: "#666" },
  empty: { textAlign: "center", marginTop: 40, color: "#999" },
});
