
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/context/auth.context";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoggingOut(true);

              await signOut();

              router.replace("/(auth)/login");
            } catch (error) {
              Alert.alert(
                "Logout Failed",
                "Unable to logout. Please try again."
              );
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.name || "User"}
        </Text>

        <Text style={styles.email}>
          {user?.email || "No email available"}
        </Text>

        <Text style={styles.role}>
          {user?.role || "User"}
        </Text>
      </View>

      <Pressable
        style={[
          styles.logoutButton,
          isLoggingOut && styles.disabledButton,
        ]}
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.logoutText}>Logout</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  profileCard: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 6,
  },
  email: {
    fontSize: 15,
    color: "#64748B",
  },
  role: {
    fontSize: 13,
    color: "#2563EB",
    marginTop: 10,
    textTransform: "capitalize",
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
