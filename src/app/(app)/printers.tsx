
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import api from "@/services/api.service";

type Printer = {
  _id: string;
  name: string;
  printerId: string;
  status: "online" | "offline";
  lastSeen: string | null;
  isActive: boolean;
};

export default function PrintersScreen() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPrinters = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/printers/my");

      setPrinters(response.data.printers || []);
  } catch (err: any) {
  console.log("FETCH PRINTERS ERROR:", err.message);
  console.log("ERROR STATUS:", err.response?.status);
  console.log("ERROR RESPONSE:", err.response?.data);

  setError(
    err.response?.data?.message ||
      err.message ||
      "Unable to fetch printers. Please try again."
  );
}
     finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrinters();
  }, [fetchPrinters]);

  const formatLastSeen = (lastSeen: string | null) => {
    if (!lastSeen) {
      return "Never connected";
    }

    return new Date(lastSeen).toLocaleString();
  };

  const renderPrinter = ({ item }: { item: Printer }) => {
    const isOnline = item.status === "online";

    return (
      <View style={styles.printerCard}>
        <View style={styles.cardHeader}>
          <View style={styles.printerIcon}>
            <Text style={styles.printerIconText}>🖨️</Text>
          </View>

          <View style={styles.printerInfo}>
            <Text style={styles.printerName}>{item.name}</Text>

            <Text style={styles.printerId}>
              ID: {item.printerId}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              isOnline ? styles.onlineBadge : styles.offlineBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isOnline ? styles.onlineText : styles.offlineText,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.lastSeen}>
            Last seen: {formatLastSeen(item.lastSeen)}
          </Text>

          {item.isActive && (
            <Text style={styles.activeLabel}>Active</Text>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading printers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Printers</Text>
          <Text style={styles.subtitle}>
            Manage your connected printers
          </Text>
        </View>

        <Pressable
          onPress={() => {
            setIsLoading(true);
            fetchPrinters();
          }}
          style={styles.refreshButton}
        >
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>{error}</Text>

          <Pressable
            onPress={() => {
              setIsLoading(true);
              fetchPrinters();
            }}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : printers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🖨️</Text>

          <Text style={styles.emptyTitle}>
            No Printers Found
          </Text>

          <Text style={styles.emptyDescription}>
            Register a printer using the PrintAnywhere web app.
            Your registered printer will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={printers}
          keyExtractor={(item) => item._id}
          renderItem={renderPrinter}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={fetchPrinters}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
  },
  refreshButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  refreshText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  loadingText: {
    marginTop: 12,
    color: "#64748B",
  },
  listContent: {
    paddingBottom: 30,
  },
  printerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  printerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  printerIconText: {
    fontSize: 24,
  },
  printerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  printerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  printerId: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  onlineBadge: {
    backgroundColor: "#DCFCE7",
  },
  offlineBadge: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  onlineText: {
    color: "#15803D",
  },
  offlineText: {
    color: "#B91C1C",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginTop: 16,
    paddingTop: 12,
  },
  lastSeen: {
    fontSize: 12,
    color: "#64748B",
    flex: 1,
  },
  activeLabel: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "700",
    marginLeft: 8,
  },
  messageContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 12,
  },
  retryText: {
    color: "#2563EB",
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 70,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  emptyDescription: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
  },
});
