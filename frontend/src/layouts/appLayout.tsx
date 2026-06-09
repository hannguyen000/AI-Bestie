import { BottomNav } from "../components/BottomNav";
import { Sidebar } from "../components/SideBar";

interface AppLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;  
}

export default function AppLayout({ children, hideNav }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* 1. Sidebar (Chỉ hiện trên desktop) */}
      {!hideNav && <Sidebar />}

      {/* 2. Nội dung chính */}
      <main className="flex-1 h-full w-full overflow-y-auto relative">
        {children}
      </main>
      
      {/* 3. BottomNav (Chỉ hiện trên mobile, ẩn trên desktop) */}
      {!hideNav && ( 
        <div className="md:hidden absolute bottom-0 left-0 w-full z-50">
          <BottomNav />
        </div>
      )}
    </div>
  );
}