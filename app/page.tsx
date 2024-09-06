import Quiz from "@/components/Quiz";
import { SkillTreeFlow } from "@/components/flow";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      <div className="flex flex-1 p-4 space-x-4">
        <div className="w-1/2 bg-[#242424] p-4 rounded-lg overflow-hidden"></div>
        <div className="w-1/2 flex flex-col space-y-4">
          <div className="flex-1 bg-[#242424] p-4 rounded-lg overflow-y-auto">
            <p className="text-sm">
              {/* TODO: Complexty here */}
              Tikal (/tiːˈkɑːl/; Tikal in modern Mayan orthography) is the ruin
              of an ancient city, which was likely to have been called Yax
              Mutal,[2] found in a rainforest in Guatemala.[3] It is one of the
              largest archeological sites and urban centers of the pre-Columbian
              Maya civilization. It is located in the archeological region of
              the Petén Basin in what is now northern Guatemala.
              {/* ... rest of the content ... */}
            </p>
          </div>
          <div className="bg-[#242424] p-4 rounded-lg">
            <Quiz jsonFile="/quizexample.json" />
          </div>
        </div>
      </div>
    </div>
  );
}
