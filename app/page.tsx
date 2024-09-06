import Quiz from "@/components/Quiz";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] text-white">
      <Quiz topic="Nuclear Fusion" />
    </div>
  );
}
