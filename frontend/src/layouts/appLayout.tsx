import { BottomNav } from "../components/BottomNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="phone-shell relative h-full w-full overflow-hidden">
      <div className="flex-1 h-full w-full overflow-hidden flex flex-col">
        {children}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full z-50">
        <BottomNav />
      </div>
    </div>
  );
}
