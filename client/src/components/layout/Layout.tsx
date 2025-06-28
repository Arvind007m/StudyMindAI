import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 main-content-margin lg:ml-[280px] ml-0">
        <main className="p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
