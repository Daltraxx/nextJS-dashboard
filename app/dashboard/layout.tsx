import SideNav from '@/app/ui/dashboard/sidenav'; // Any components imported and used in this file will be part of the layout

export const experimental_ppr = true; // adds the experimental_ppr segment config option to dashboard layout
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}