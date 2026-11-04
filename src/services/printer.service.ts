
import api from "@/services/api.service";

const getMyPrinters = async () => {
  const response = await api.get("/printers/my");

  return response.data;
};

export default {
  getMyPrinters,
};
