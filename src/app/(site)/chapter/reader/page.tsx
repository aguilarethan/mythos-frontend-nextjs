import { ChapterReader } from "@/features/chapter/chapter-reader";

export default function ReaderPage() {
  const chapterId = "685502b1ece308df59f163ac";

  return (
    <>
      <ChapterReader initialChapterId={chapterId} />
    </>
  );
}
