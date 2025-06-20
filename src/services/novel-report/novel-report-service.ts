
import { nodeApi } from "@/lib/api/node-api";
import { CreateNovelReportRequest } from "./novel-report-interfaces";

export async function createNovelReport(data: CreateNovelReportRequest) {
  try {
    const response = await nodeApi.post("/novel-reports", data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al crear el reporte de la novela";
    throw new Error(message);
  }
}