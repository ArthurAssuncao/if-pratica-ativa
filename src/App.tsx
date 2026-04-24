import StudySelectionPage from "components/StudySelectionPage";
import { Footer } from "components/ui/Footer";
import { Navbar } from "components/ui/Navbar";
import { SidebarProvider } from "context/SidebarProvider";
import "./App.css";

export default function App() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-blue-50 dark:bg-slate-950 transition-colors">
        <header>
          <Navbar />
        </header>
        <div className="flex">
          <StudySelectionPage />
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
