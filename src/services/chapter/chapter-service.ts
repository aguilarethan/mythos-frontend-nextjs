import { nodeApi } from "@/lib/api/node-api";
import { dotnetApi } from "@/lib/api/dotnet-api"

import { Chapter, CreateChapterRequest, PurchaseResult, PurchaseStatus, GeneratePDFRequest } from "./chapter-interfaces";

export async function createChapter(data: CreateChapterRequest) {
  try {
    const response = await nodeApi.post("/chapters", data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al crear el capítulo";
    throw new Error(message);
  }
}

export async function getChaptersByNovelId(novelId: string) {
  try {
    const response = await nodeApi.get(`/chapters/novel/${novelId}`);
    return response.data; // Asegúrate que regrese un array de capítulos
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al obtener capítulos";
    throw new Error(message);
  }
}

// Aquí se realizaría la llamada al backend para obtener el capítulo por ID
export async function getChapterById(chapterId: string): Promise<Chapter> {
  // Simulamos un retraso de red
  try {
    const response = await nodeApi.get(`/chapters/${chapterId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al obtener el capítulo";
    throw new Error(message);
  }
}

// Aquí se verifica si el usuario ya compró el capítulo
export async function checkPurchaseStatus(chapterId: string): Promise<PurchaseStatus> {
  try {
    const response = await dotnetApi.get<string[]>("/purchases/contents");
    const purchasedContentIds = response.data;

    const isPurchased = purchasedContentIds.includes(chapterId);

    return { isPurchased };
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al verificar el estado de compra";
    console.error(message);
    return { isPurchased: false }; // fallback seguro
  }
}

// Aquí se simula la compra del capítulo
export async function purchaseChapter1(chapterId: string, userId = "user123"): Promise<PurchaseResult> {
  // Simulamos un retraso de red para la transacción
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulamos diferentes resultados de compra
  const random = Math.random()

  if (random > 0.8) {
    // 20% de probabilidad de error (fondos insuficientes)
    return {
      success: false,
      message: "Fondos insuficientes. Necesitas más Mythras para completar esta compra.",
    }
  } else if (random > 0.9) {
    // 10% de probabilidad de error del servidor
    return {
      success: false,
      message: "Error del servidor. Por favor, inténtalo de nuevo más tarde.",
    }
  } else {
    // 70% de probabilidad de éxito
    return {
      success: true,
      message: "¡Capítulo comprado exitosamente!",
      newBalance: 85, // Nuevo balance simulado
    }
  }
}

export async function purchaseChapter(chapterId: string, price: number): Promise<PurchaseResult> {
  try {
    const response = await dotnetApi.post<PurchaseResult>("/purchases/buy", {
      contentId: chapterId,
      price: price,
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al realizar la compra";
    console.error(message);
    return {
      success: false,
      message,
    };
  }
}

export async function generateChapterPDF(data: GeneratePDFRequest) {
  try {
    const response = await nodeApi.post("/chapters/generate-pdf", data, {
      responseType: 'blob', 
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    
    const url = window.URL.createObjectURL(pdfBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `capitulo-${data.chapterNumber}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true; // Indica éxito
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al generar el PDF";
    throw new Error(message);
  }
}
