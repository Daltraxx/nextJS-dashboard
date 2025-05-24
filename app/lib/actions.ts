// By adding the 'use server', you mark all the exported functions within the file as Server Actions. 
// These server functions can then be imported and used in Client and Server components. 
// Any functions included in this file that are not used will be automatically removed from the final application bundle.
'use server';

import { z } from 'zod';

const FormSchema = z.object({
   id: z.string(),
   customerId: z.string(),
   amount: z.coerce.number(),
   status: z.enum(['pending', 'paid']),
   date: z.string()
});

export async function createInvoice(formData: FormData) {
   const rawFormData = {
      // Tip: If you're working with forms that have many fields, you may want to consider using the entries() method with JavaScript's Object.fromEntries()
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status')
   };
   // console.log(rawFormData);
}

