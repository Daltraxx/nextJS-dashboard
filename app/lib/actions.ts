// By adding the 'use server', you mark all the exported functions within the file as Server Actions. 
// These server functions can then be imported and used in Client and Server components. 
// Any functions included in this file that are not used will be automatically removed from the final application bundle.
'use server';

import { z } from 'zod';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
   id: z.string(), // created on database
   customerId: z.string(),
   amount: z.coerce.number(),
   status: z.enum(['pending', 'paid']),
   date: z.string()
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
   const rawFormData = {
      // Tip: If you're working with forms that have many fields, you may want to consider using the entries() method with JavaScript's Object.fromEntries()
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status')
   };
   // console.log(rawFormData);

   const { customerId, amount, status } = CreateInvoice.parse(rawFormData);

   const amountInCents = amount * 100; // it's usually good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy
   const date = new Date().toISOString().split('T')[0];

   await sql `
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
   `;
   
}

