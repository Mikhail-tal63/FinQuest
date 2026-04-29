import { FinQuestProvider } from "@/context/FinQuestContext";
import { DesktopLayout } from "@/components/finquest/DesktopLayout";

const Index = () => {
  return (
    <FinQuestProvider>
      <DesktopLayout />
    </FinQuestProvider>
  );
};

export default Index;
