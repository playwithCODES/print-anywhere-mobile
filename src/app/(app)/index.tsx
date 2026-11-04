
import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import { useAuth } from "@/context/auth.context";
import api from "@/services/api.service";

export default function DashboardScreen() {
  const { user, signOut } = useAuth();

  const [printerCount, setPrinterCount] = useState<number | null>(null);
  const [jobCount, setJobCount] = useState<number | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch dashboard statistics
  const fetchDashboardStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);

      const [printerResponse, jobsResponse] = await Promise.all([
        api.get("/printers/my"),
        api.get("/print-jobs/my"),
      ]);

      console.log("PRINTER API RESPONSE:", printerResponse.data);
      console.log("PRINT JOBS API RESPONSE:", jobsResponse.data);

      const printers = printerResponse.data.printers || [];
      const printJobs = jobsResponse.data.printJobs || [];

      setPrinterCount(printers.length);
      setJobCount(printJobs.length);
    } catch (error: any) {
      console.log(
        "DASHBOARD STATS ERROR:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Logout confirmation
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
              await signOut();
              router.replace("/(auth)/login");
            } catch (error: any) {
              Alert.alert(
                "Logout Failed",
                error.message || "Unable to logout."
              );
            }
          },
        },
      ]
    );
  };

  // Statistics display
  const renderStatValue = (value: number | null) => {
    if (isLoadingStats) {
      return (
        <ActivityIndicator
          size="small"
          color="#2563EB"
          style={styles.statLoader}
        />
      );
    }

    return (
      <Text style={styles.statValue}>
        {value !== null ? value : "--"}
      </Text>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>

          <Text style={styles.username}>
            {user?.name || "User"}
          </Text>
        </View>

        {/* Clickable User Avatar */}
        <Pressable
          style={({ pressed }) => [
            styles.avatar,
            pressed && styles.avatarPressed,
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </Text>
        </Pressable>
      </View>

      {/* Main Print Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Text style={styles.printerIcon}>🖨️</Text>
        </View>

        <Text style={styles.heroTitle}>
          Print from anywhere
        </Text>

        <Text style={styles.heroDescription}>
          Send documents to your registered printers directly
          from your mobile device.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressedButton,
          ]}
          onPress={() => router.push("/print")}
        >
          <Text style={styles.primaryButtonText}>
            Print a Document
          </Text>
        </Pressable>
      </View>

      {/* Quick Overview */}
      <Text style={styles.sectionTitle}>
        Quick Overview
      </Text>

      <View style={styles.statsContainer}>
        {/* Registered Printers */}
        <Pressable
          style={({ pressed }) => [
            styles.statCard,
            pressed && styles.pressedCard,
          ]}
          onPress={() => router.push("/printers")}
        >
          <Text style={styles.statIcon}>🖨️</Text>

          {renderStatValue(printerCount)}

          <Text style={styles.statLabel}>
            Registered Printers
          </Text>
        </Pressable>

        {/* Print Jobs */}
        <Pressable
          style={({ pressed }) => [
            styles.statCard,
            pressed && styles.pressedCard,
          ]}
          onPress={() => router.push("/jobs")}
        >
          <Text style={styles.statIcon}>📄</Text>

          {renderStatValue(jobCount)}

          <Text style={styles.statLabel}>
            Print Jobs
          </Text>
        </Pressable>
      </View>

      {/* Get Started */}
      <Text style={styles.sectionTitle}>
        Get Started
      </Text>

      {/* Select Document */}
      <Pressable
        style={({ pressed }) => [
          styles.actionCard,
          pressed && styles.pressedCard,
        ]}
        onPress={() => router.push("/print")}
      >
        <View style={styles.actionIcon}>
          <Text style={styles.actionEmoji}>📁</Text>
        </View>

        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>
            Select a Document
          </Text>

          <Text style={styles.actionDescription}>
            Choose a document from your device to start printing.
          </Text>
        </View>

        <Text style={styles.actionArrow}>›</Text>
      </Pressable>

      {/* Connect Printer */}
      <Pressable
        style={({ pressed }) => [
          styles.actionCard,
          pressed && styles.pressedCard,
        ]}
        onPress={() => router.push("/printers")}
      >
        <View style={styles.actionIcon}>
          <Text style={styles.actionEmoji}>🌐</Text>
        </View>

        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>
            Connect to Your Printer
          </Text>

          <Text style={styles.actionDescription}>
            Manage your registered printer through the
            PrintAnywhere Agent.
          </Text>
        </View>

        <Text style={styles.actionArrow}>›</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 24,
    paddingTop: 56,
    paddingBottom: 32,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  greeting: {
    fontSize: 15,
    color: "#64748B",
  },

  username: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 4,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarPressed: {
    opacity: 0.7,
  },

  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563EB",
  },

  heroCard: {
    backgroundColor: "#2563EB",
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
  },

  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  printerIcon: {
    fontSize: 30,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  heroDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "#DBEAFE",
    marginBottom: 24,
  },

  primaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563EB",
  },

  pressedButton: {
    opacity: 0.8,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 16,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statIcon: {
    fontSize: 24,
    marginBottom: 14,
  },

  statValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
  },

  statLoader: {
    alignSelf: "flex-start",
    height: 31,
    justifyContent: "center",
  },

  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
  },

  pressedCard: {
    opacity: 0.75,
  },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  actionEmoji: {
    fontSize: 24,
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 5,
  },

  actionDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
  },

  actionArrow: {
    fontSize: 28,
    color: "#94A3B8",
    marginLeft: 8,
  },
});
