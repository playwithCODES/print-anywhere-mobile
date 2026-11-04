
import { useEffect, useState } from "react";
import api from "@/services/api.service";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

import uploadService from "@/services/upload.service";
import printerService from "@/services/printer.service";

type Printer = {
  _id: string;
  name: string;
  printerId: string;
  status: "online" | "offline";
  isActive: boolean;
};

export default function PrintScreen() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [selectedPrinterId, setSelectedPrinterId] = useState("");

  const [selectedDocument, setSelectedDocument] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const [copies, setCopies] = useState(1);

  const [loadingPrinters, setLoadingPrinters] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadPrinters = async () => {
      try {
        setLoadingPrinters(true);

        const response = await printerService.getMyPrinters();

        const activePrinters = (
          Array.isArray(response?.printers)
            ? response.printers
            : []
        ).filter((printer: Printer) => printer.isActive);

        setPrinters(activePrinters);
      } catch (error: any) {
        console.log(
          "PRINTER FETCH ERROR:",
          error.response?.data || error.message
        );

        Alert.alert(
          "Printer Error",
          error.response?.data?.message ||
            "Unable to load registered printers."
        );
      } finally {
        setLoadingPrinters(false);
      }
    };

    loadPrinters();
  }, []);

  const selectedPrinter = printers.find(
    (printer) => printer.printerId === selectedPrinterId
  );

  const onlinePrinters = printers.filter(
    (printer) => printer.status === "online"
  );

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "image/jpeg",
          "image/png",
          "text/plain",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled) {
        const document = result.assets[0];

        if (document.size && document.size > 20 * 1024 * 1024) {
          Alert.alert(
            "File Too Large",
            "Please select a file smaller than 20 MB."
          );
          return;
        }

        setSelectedDocument(document);
      }
    } catch (error: any) {
      console.log("DOCUMENT PICKER ERROR:", error);

      Alert.alert(
        "Document Picker Error",
        error?.message || "Unable to open the document picker."
      );
    }
  };

  const uploadSelectedDocument = async () => {
    if (!selectedPrinterId || !selectedPrinter) {
      Alert.alert(
        "Select Printer",
        "Please select an online printer first."
      );
      return;
    }

    if (selectedPrinter.status !== "online") {
      Alert.alert(
        "Printer Offline",
        "The selected printer is currently offline."
      );
      return;
    }

    if (!selectedDocument) {
      Alert.alert(
        "Select a Document",
        "Please select a document first."
      );
      return;
    }

    try {
      setIsUploading(true);

      const uploadedDocument =
        await uploadService.uploadDocument(selectedDocument);

      console.log("UPLOADED DOCUMENT:", uploadedDocument);

      const jobResponse = await api.post("/print-jobs", {
        printerId: selectedPrinter.printerId,
        fileName: uploadedDocument.fileName,
        fileUrl: uploadedDocument.fileUrl,
        copies,
      });

      console.log(
        "CREATED PRINT JOB:",
        jobResponse.data.printJob
      );

      Alert.alert(
        "Print Job Created",
        `${uploadedDocument.fileName} has been added to ${selectedPrinter.name}'s print queue.`
      );

      setSelectedDocument(null);
      setCopies(1);
    } catch (error: any) {
      console.log("PRINT ERROR:", error.message);
      console.log("PRINT STATUS:", error.response?.status);
      console.log("PRINT RESPONSE:", error.response?.data);

      Alert.alert(
        "Print Failed",
        error.response?.data?.message ||
          error.message ||
          "Unable to create print job."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Print Document</Text>

      <Text style={styles.subtitle}>
        Select a printer and document to start printing.
      </Text>

      {/* Printer Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Select Printer
        </Text>

        {loadingPrinters ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#2563EB" />
            <Text style={styles.loadingText}>
              Loading printers...
            </Text>
          </View>
        ) : printers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="print-outline"
              size={30}
              color="#94A3B8"
            />

            <Text style={styles.emptyText}>
              No active printers registered.
            </Text>
          </View>
        ) : (
          printers.map((printer) => {
            const isSelected =
              selectedPrinterId === printer.printerId;

            const isOnline = printer.status === "online";

            return (
              <Pressable
                key={printer._id}
                disabled={!isOnline || isUploading}
                onPress={() =>
                  setSelectedPrinterId(printer.printerId)
                }
                style={[
                  styles.printerCard,
                  isSelected && styles.selectedPrinterCard,
                  !isOnline && styles.offlinePrinterCard,
                ]}
              >
                <View style={styles.printerInfo}>
                  <Ionicons
                    name="print-outline"
                    size={25}
                    color={isSelected ? "#2563EB" : "#64748B"}
                  />

                  <View style={styles.printerDetails}>
                    <Text style={styles.printerName}>
                      {printer.name}
                    </Text>

                    <Text
                      style={[
                        styles.printerStatus,
                        {
                          color: isOnline ? "#16A34A" : "#EF4444",
                        },
                      ]}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name={
                    isSelected
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={23}
                  color={isSelected ? "#2563EB" : "#94A3B8"}
                />
              </Pressable>
            );
          })
        )}

        {!loadingPrinters && onlinePrinters.length === 0 && (
          <Text style={styles.warningText}>
            No online printer available. Please connect your Printer Agent.
          </Text>
        )}
      </View>

      {/* Document Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Select Document
        </Text>

        <Pressable
          style={styles.selectButton}
          onPress={pickDocument}
          disabled={isUploading}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={25}
            color="#2563EB"
          />

          <Text style={styles.selectButtonText}>
            Choose Document
          </Text>
        </Pressable>

        {selectedDocument && (
          <View style={styles.selectedDocument}>
            <View style={styles.documentInfo}>
              <Ionicons
                name="document-text-outline"
                size={25}
                color="#2563EB"
              />

              <View style={styles.documentDetails}>
                <Text
                  style={styles.documentName}
                  numberOfLines={2}
                >
                  {selectedDocument.name}
                </Text>

                <Text style={styles.documentSize}>
                  {(
                    (selectedDocument.size || 0) /
                    (1024 * 1024)
                  ).toFixed(2)} MB
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setSelectedDocument(null)}
              disabled={isUploading}
              style={styles.removeButton}
            >
              <Ionicons
                name="close-circle"
                size={27}
                color="#EF4444"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Copies */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Number of Copies
        </Text>

        <View style={styles.copiesControls}>
          <Pressable
            style={styles.counterButton}
            disabled={isUploading}
            onPress={() =>
              setCopies((current) => Math.max(1, current - 1))
            }
          >
            <Text style={styles.counterText}>−</Text>
          </Pressable>

          <Text style={styles.copiesValue}>
            {copies}
          </Text>

          <Pressable
            style={styles.counterButton}
            disabled={isUploading}
            onPress={() =>
              setCopies((current) => Math.min(99, current + 1))
            }
          >
            <Text style={styles.counterText}>+</Text>
          </Pressable>
        </View>
      </View>

      {/* Print Button */}
      <Pressable
        style={[
          styles.uploadButton,
          (
            !selectedDocument ||
            !selectedPrinter ||
            selectedPrinter.status !== "online" ||
            isUploading ||
            loadingPrinters
          ) && styles.disabledButton,
        ]}
        disabled={
          !selectedDocument ||
          !selectedPrinter ||
          selectedPrinter.status !== "online" ||
          isUploading ||
          loadingPrinters
        }
        onPress={uploadSelectedDocument}
      >
        {isUploading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.uploadButtonText}>
            Print Document
          </Text>
        )}
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
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 8,
    lineHeight: 22,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  loadingText: {
    color: "#64748B",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  emptyText: {
    color: "#64748B",
    marginTop: 8,
  },
  printerCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedPrinterCard: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  offlinePrinterCard: {
    opacity: 0.55,
  },
  printerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  printerDetails: {
    flex: 1,
  },
  printerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  printerStatus: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 5,
  },
  warningText: {
    fontSize: 13,
    color: "#DC2626",
    marginTop: 8,
  },
  selectButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  selectButtonText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
  },
  selectedDocument: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  documentDetails: {
    flex: 1,
  },
  documentName: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
  },
  documentSize: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 5,
  },
  removeButton: {
    padding: 5,
    marginLeft: 8,
  },
  copiesControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: {
    fontSize: 24,
    color: "#0F172A",
  },
  copiesValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  uploadButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 35,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
