//By wrapping [id] in square brackets within the /invoices folder, we have created a dynamic route segment (/dashboard/invoices/[id]/edit)

import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page(props: { params: Promise<{ id: string }> }) { // Page components can accept a prop called params which you can use to access the id
   const params = await props.params;
   const id = params.id;

   const [invoice, customers] = await Promise.all([fetchInvoiceById(id), fetchCustomers()]);

   //if invoice not found, trigger not-found.tsx
   if (!invoice) {
      notFound();
   }

   return (
      <main>
         <Breadcrumbs
         breadcrumbs={[
            { label: 'Invoices', href: '/dashboard/invoices' },
            {
               label: 'Edit Invoice',
               href: `/dashboard/invoices/${id}/edit`,
               active: true,
            },
         ]}
         />
         <Form invoice={invoice} customers={customers} />
      </main>
   );
}