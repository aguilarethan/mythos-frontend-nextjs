export interface CreateChapterRequest {
    novelId: string;
    title: string;
    content: string;
    priceMythras: number;
}

export interface ReducedChapter {
  id: string;
  title: string;
  createdAt: string;
  priceMythras: number;
}

export interface Chapter {
  id: string
  novelId: string
  title: string
  content: string
  chapterNumber: number
  bookTitle: string
  priceMythras: number // precio en Mythras
}

export interface PurchaseStatus {
  isPurchased: boolean
}

export interface PurchaseResult {
  success: boolean
  message: string
  newBalance?: number
}