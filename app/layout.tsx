// This file is used for the root layout and is required in every Next.js application
// Any UI you add to the root layout will be shared across all pages in your application. You can use the root layout to modify your <html> and <body> tags, and add metadata

import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts'; // inter is imported from fonts.ts and used as the main body font. antialiased is a tailwind class to smooth out the font (not strictly necessary)
import { Metadata } from 'next';

// Add metadata (applied in html head)
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard', // %s in the template will be replaced with the specific page title
    default: 'Acme Dashboard'
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh')
}

export default function RootLayout({ children }: { children: React.ReactNode;}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} antialiased`}>{children}</body>
//     </html>
//   );
// }