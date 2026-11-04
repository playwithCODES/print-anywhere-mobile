
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
  isActive: boolean;
};

type PrintJob = {
  _id: string;
  fileName: string;
  copies: number;
  status: "queued" | "printing" | "completed" | "failed";
  createdAt: string;
  printer: Printer | null;
};

const getStatusStyle = (status: PrintJob["status"]) => {
  switch (status) {
    case "queued":
      return {
        backgroundColor: "#FEF3C7",
        color: "#92400E",
      };

    case "printing":
      return {
        backgroundColor: "#DBEAFE",
        color: "#1D4ED8",
      };

    case "completed":
      return {
        backgroundColor: "#DCFCE7",
        color: "#15803D",
      };

    case "failed":
      return {
        backgroundColor: "#FEE2E2",
        color: "#B91C1C",
      };

    default:
      return {
        backgroundColor: "#F1F5F9",
        color: "#475569",
      };
  }
};

export default function JobsScreen() {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPrintJobs = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/print-jobs/my");

      setPrintJobs(response.data.printJobs || []);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Unable to fetch print jobs. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrintJobs();
  }, [fetchPrintJobs]);

  const renderJob = ({ item }: { item: PrintJob }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <View style={styles.documentIcon}>
            <Text style={styles.documentIconText}>📄</Text>
          </View>

          <View style={styles.jobInfo}>
            <Text style={styles.fileName} numberOfLines={2}>
              {item.fileName}
            </Text>

            <Text style={styles.printerName}>
              {item.printer?.name || "Unknown printer"}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: statusStyle.color },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.jobFooter}>
          <Text style={styles.jobMeta}>
            Copies: {item.copies}
          </Text>

          <Text style={styles.jobMeta}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />

        <Text style={styles.loadingText}>
          Loading print jobs...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Print Jobs</Text>

          <Text style={styles.subtitle}>
            Track your documents
          </Text>
        </View>

        <Pressable
          onPress={() => {
            setIsLoading(true);
            fetchPrintJobs();
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
              fetchPrintJobs();
            }}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : printJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📄</Text>

          <Text style={styles.emptyTitle}>
            No Print Jobs Yet
          </Text>

          <Text style={styles.emptyDescription}>
            Documents you send for printing will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={printJobs}
          keyExtractor={(item) => item._id}
          renderItem={renderJob}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={fetchPrintJobs}
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
  jobCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  jobHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  documentIconText: {
    fontSize: 24,
  },
  jobInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  fileName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  printerName: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginTop: 16,
    paddingTop: 12,
  },
  jobMeta: {
    fontSize: 11,
    color: "#64748B",
    flexShrink: 1,
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
