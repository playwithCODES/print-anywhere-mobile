
import * as DocumentPicker from "expo-document-picker";

import api from "@/services/api.service";

const getMimeType = (
  document: DocumentPicker.DocumentPickerAsset
) => {
  if (document.mimeType) {
    return document.mimeType;
  }

  const extension = document.name.split(".").pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };

  return mimeTypes[extension || ""] || "application/octet-stream";
};

const uploadDocument = async (
  document: DocumentPicker.DocumentPickerAsset
) => {
  const formData = new FormData();

  formData.append("document", {
    uri: document.uri,
    name: document.name,
    type: getMimeType(document),
  } as any);

  const response = await api.post("/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export default {
  uploadDocument,
};
