import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import type { HomeStackParamList, HistoryStackParamList, ProgramsStackParamList } from "./types";

import SignInScreen from "../screens/SignInScreen";
import HomeScreen from "../screens/HomeScreen";
import ActiveWorkoutScreen from "../screens/ActiveWorkoutScreen";
import HistoryScreen from "../screens/HistoryScreen";
import WorkoutDetailScreen from "../screens/WorkoutDetailScreen";
import ProgramsScreen from "../screens/ProgramsScreen";

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
const ProgramsStack = createNativeStackNavigator<ProgramsStackParamList>();
const Tab = createBottomTabNavigator();

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.textPrimary,
  contentStyle: { backgroundColor: colors.background },
};

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={stackScreenOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} options={{ title: "Workout" }} />
    </HomeStack.Navigator>
  );
}

function HistoryNavigator() {
  return (
    <HistoryStack.Navigator screenOptions={stackScreenOptions}>
      <HistoryStack.Screen name="History" component={HistoryScreen} options={{ title: "History" }} />
      <HistoryStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} options={{ title: "Workout Detail" }} />
    </HistoryStack.Navigator>
  );
}

function ProgramsNavigator() {
  return (
    <ProgramsStack.Navigator screenOptions={stackScreenOptions}>
      <ProgramsStack.Screen name="Programs" component={ProgramsScreen} options={{ title: "Programs" }} />
    </ProgramsStack.Navigator>
  );
}

export default function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      {!session ? (
        <SignInScreen />
      ) : (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
            },
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.textMuted,
          }}
        >
          <Tab.Screen name="HomeTab" component={HomeNavigator} options={{ title: "Home" }} />
          <Tab.Screen name="ProgramsTab" component={ProgramsNavigator} options={{ title: "Programs" }} />
          <Tab.Screen name="HistoryTab" component={HistoryNavigator} options={{ title: "History" }} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}