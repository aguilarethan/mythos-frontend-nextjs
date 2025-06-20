"use client";

import NovelInformation from "@/features/novel/components/novel-information";
import { useNovelStore } from "@/store/novel-store";
import { useNovelDetailsStore } from "@/store/novel-details-store";
import { getNovelById } from "@/services/novel/novel-service";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function NovelPage() {
  const { selectedId } = useNovelStore();
  const { setNovelDetails, ...novel } = useNovelDetailsStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedId) {
      setIsLoading(false);
      return;
    }

    const fetchNovel = async () => {
      setIsLoading(true);
      try {
        const data = await getNovelById(selectedId);
        setNovelDetails(data);
      } catch (error) {
        toast.error("Error al cargar la novela");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNovel();
  }, [selectedId, setNovelDetails]);

  return (
    <div className="max-w-5xl items-center mx-auto py-4">
      <NovelInformation
        {...novel}
        isLoading={isLoading}
      />
    </div>
  );
}