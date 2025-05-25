// By adding the 'use server', you mark all the exported functions within the file as Server Actions. 
// These server functions can then be imported and used in Client and Server components. 
// Any functions included in this file that are not used will be automatically removed from the final application bundle.
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache'; // used to clear cache and trigger a new request to the server
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// enforce schema when adding data to db and provide messages when form submission does not satisfy requirements
const FormSchema = z.object({
   id: z.string(),
   customerId: z.string({
      invalid_type_error: 'Please select a customer.'
   }),
   amount: z.coerce
      .number()
      .gt(0, { message: 'Please enter an amount greater than $0.'}), // .gt() method in Zod is used to specify that a number must be greater than a given value
   status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.'
   }),
   date: z.string()
});

export type State = {
   errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
   };
   message?: string | null;
}

const CreateInvoice = FormSchema.omit({ id: true, date: true }); // id created in database and date created in createInvoice

export async function createInvoice(prevState: State, formData: FormData) {
   // prevState - contains the state passed from the useActionState hook. It's not being used here, but is a required prop

   const rawFormData = {
      // Tip: If you're working with forms that have many fields, you may want to consider using the entries() method with JavaScript's Object.fromEntries()
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status')
   };
   // console.log(rawFormData);

   const validatedFields = CreateInvoice.safeParse(rawFormData);

   // If form validation fails, return errors early. Otherwise, continue.
   if (!validatedFields.success) {
      return {
         errors: validatedFields.error.flatten().fieldErrors,
         message: 'Missing Fields. Failed to Create Invoice'
      }
   }

   // Prepare data for insertion into the database
   const { customerId, amount, status } = validatedFields.data;
   const amountInCents = amount * 100; // it's usually good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy
   const date = new Date().toISOString().split('T')[0];

   // Insert data into database
   try {
      await sql `
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
   } catch (error) {
      // If a database error occurs, return a more specific error.
      return {
         message: 'Database Error: Failed to Create Invoice.',
      };
   }
   
   // Revalidate the cache for the invoices page and redirect the user.
   revalidatePath('/dashboard/invoices');
   redirect('/dashboard/invoices');
   // Note that, since redirect works by throwing an error, it must be called outside the try/catch block
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
   const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status')
   };

   const { customerId, amount, status } = UpdateInvoice.parse(rawFormData);

   const amountInCents = amount * 100;

   try {
      await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
      `;
   } catch (error) {
      console.error(error);
   }
 
   revalidatePath('/dashboard/invoices');
   redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
   // throw new Error('Failed to Delete Invoice'); use to simulate an uncaught exception, which will trigger the error.tsx file in /dashboard/invoices

   try {
      await sql `DELETE FROM invoices WHERE id = ${id}`;
   } catch (error) {
      console.error(error);
   }
   revalidatePath('/dashboard/invoices');
   // Since this action is being called in the /dashboard/invoices path, you don't need to call redirect. 
   // Calling revalidatePath will trigger a new server request and re-render the table.
}

