// Route groups allow you to organize files into logical groups without affecting the URL path structure. 
// When you create a new folder using parentheses (), the name won't be included in the URL path. 
// So /dashboard/(overview)/page.tsx becomes /dashboard.
// Here, you're using a route group to ensure loading.tsx only applies to your dashboard overview page. 
// However, you can also use route groups to separate your application into sections 
// (e.g. (marketing) routes and (shop) routes) or by teams for larger applications.

import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';

import { fetchRevenue, fetchLatestInvoices, fetchCardData } from '../../lib/data';
 
export default async function Page() {
    const revenue = await fetchRevenue();
    const latestInvoices = await fetchLatestInvoices();
    const { numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices} = await fetchCardData();
    return (
        <main>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Dashboard
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card title="Collected" value={totalPaidInvoices} type="collected" />
            <Card title="Pending" value={totalPendingInvoices} type="pending" />
            <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
            <Card title="Total Customers" value={numberOfCustomers} type="customers" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
            <RevenueChart revenue={revenue}  />
            <LatestInvoices latestInvoices={latestInvoices} />
        </div>
        </main>
    );
}