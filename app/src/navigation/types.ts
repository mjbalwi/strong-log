export type HomeStackParamList = {
  Home: undefined;
  ActiveWorkout: { workoutId: string };
};

export type HistoryStackParamList = {
  History: undefined;
  WorkoutDetail: { workoutId: string };
};

export type ProgramsStackParamList = {
  Programs: undefined;
};