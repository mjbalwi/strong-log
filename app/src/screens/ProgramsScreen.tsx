import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function ProgramsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Programs</Text>
            <Text style={styles.sub}>Coming soon</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
    title: { fontSize: 24, fontWeight: "700", color: colors.textPrimary },
    sub: { fontSize: 16, color: colors.textSecondary, marginTop: 8 },
});
