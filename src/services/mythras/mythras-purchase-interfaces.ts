export interface MythrasPackage {
    mythrasPackageId: number;
    name: string;
    mythrasAmount: number;
    price: number;
    bonusMythras: number;
}

export interface PurchaseMythrasRequest {
    mythrasPackageId: number;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvc: string;
    cardType: string;
    billingAddress: {
        street: string;
        postalCode: string;
        city: string;
        country: string;
    };
}

export interface PurchaseMythrasResponse {
  message: string;
  mythrasBalance: number;
  walletLastUpdated: string;
}