// Route groups allow you to organize files into logical groups without affecting the URL path structure. 
// When you create a new folder using parentheses (), the name won't be included in the URL path. 
// So /dashboard/(overview)/page.tsx becomes /dashboard.
// Here, you're using a route group to ensure loading.tsx only applies to your dashboard overview page. 
// However, you can also use route groups to separate your application into sections 
// (e.g. (marketing) routes and (shop) routes) or by teams for larger applications.

import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Dashboard'
}


import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';

import { Suspense } from 'react'; // used to wrap RevenueChart and provide fallback while it fetches slow-loading data inside the component, allowing rest of page to load without slow component blocking it
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardSkeleton } from '@/app/ui/skeletons';
 
export default async function Page() {
    return (
        <main>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Dashboard
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<CardSkeleton />}>
                <CardWrapper />
            </Suspense>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
            <Suspense fallback={<RevenueChartSkeleton />}>
                <RevenueChart />
            </Suspense>
            <Suspense fallback={<LatestInvoicesSkeleton />}>
                <LatestInvoices />
            </Suspense>
        </div>
        </main>
    );
}

// NOTE: Deciding where to place your Suspense boundaries
// Where you place your Suspense boundaries will depend on a few things:
// - How you want the user to experience the page as it streams.
// - What content you want to prioritize.
// - If the components rely on data fetching.

// Don't worry. There isn't a right answer.
// - You could stream the whole page like we did with loading.tsx... but that may lead to a longer loading time if one of the components has a slow data fetch.
// - You could stream every component individually... but that may lead to UI popping into the screen as it becomes ready.
// - You could also create a staggered effect by streaming page sections. But you'll need to create wrapper components.

// Where you place your suspense boundaries will vary depending on your application. 
// In general, it's good practice to move your data fetches down to the components that need it, and then wrap those components in Suspense. 
// But there is nothing wrong with streaming the sections or the whole page if that's what your application needs.