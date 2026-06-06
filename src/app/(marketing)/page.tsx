import { Hero } from "@/components/sections/Hero";
import { KnowledgeUniverse } from "@/components/sections/KnowledgeUniverse";
import { QuestionBank } from "@/components/sections/QuestionBank";
import { VideoLearning } from "@/components/sections/VideoLearning";
import { AITutor } from "@/components/sections/AITutor";
import { MockTestCenter } from "@/components/sections/MockTestCenter";
import { VivaSimulator } from "@/components/sections/VivaSimulator";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <KnowledgeUniverse />
      <QuestionBank />
      <VideoLearning />
      <AITutor />
      <MockTestCenter />
      <VivaSimulator />
      <SuccessStories />
      <FeatureGrid />
      <FinalCTA />
    </>
  );
}
