import { AxiosError } from "axios";
import { dotnetApi } from "@/lib/api/dotnet-api";
import { MythrasPackage, PurchaseMythrasRequest, PurchaseMythrasResponse } from "./mythras-purchase-interfaces";

async function getPackages(): Promise<MythrasPackage[]> {
  try {
    const res = await dotnetApi.get("/mythras-packages");
    return res.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.message || "Error al obtener paquetes de Mythras",
      };
    } else if (error instanceof Error) {
      throw {
        status: undefined,
        message: error.message || "Error desconocido al obtener paquetes de Mythras",
      };
    } else {
      throw {
        status: undefined,
        message: "Error desconocido al obtener paquetes de Mythras",
      };
    }
  }
}

async function purchaseMythras(data: PurchaseMythrasRequest): Promise<PurchaseMythrasResponse> {
  try {
    const res = await dotnetApi.post("/mythras-purchase", data);
    return res.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.message || "Error al procesar la compra",
      };
    } else if (error instanceof Error) {
      throw {
        status: undefined,
        message: error.message || "Error desconocido al procesar la compra",
      };
    } else {
      throw {
        status: undefined,
        message: "Error desconocido al procesar la compra",
      };
    }
  }
}

export const mythrasPurchaseService = {
  getPackages,
  purchaseMythras,
};