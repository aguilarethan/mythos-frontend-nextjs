import { dotnetApi } from "@/lib/api/dotnet-api";
import { SubscribeDto } from "./subscription-interfaces";
import { AxiosError } from "axios";

async function subscribeToPremiumPlan(data: SubscribeDto){
    try {
        const response = await dotnetApi.post(`/subscription-plans/subscribe`, data);
        return response.data; 
    } catch (error : unknown) {
        let message = "Ocurrió un error al procesar la suscripción. Por favor, inténtelo de nuevo más tarde.";

        if (error instanceof AxiosError) {
            console.error("Error details:", error.message);
            message = error.response?.data?.message || message;
        } else if (error instanceof Error) {
            message = error.message;
            console.error("Error details:", error.message);
        }
            
        throw new Error(message);
    }
}

export const subscriptionService = {
    subscribeToPremiumPlan,
}