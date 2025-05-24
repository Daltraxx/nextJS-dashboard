'use client';

import { useDebouncedCallback } from 'use-debounce'; // used to apply debouncing to handleSearch event handler

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'; 
// useSearchParams allows access to the parameters of the current URL, e.g. /dashboard/invoices?page=1&query=pending would look like this: {page: '1', query: 'pending'}
// useRouter enable navigation between routes within client components programmatically, with multiple available methods
// usePathName lets you read the current URL's pathname, i.e. for the route /dashboard/invoices, usePathname would return '/dashboard/invoices'

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`); // used to illustrate debouncing
    const params = new URLSearchParams(searchParams.toString()); // URLSearchParams is a Web API that provides utility methods for manipulating the URL query parameters

    // set the params string based on the user’s input. If the input is empty, you want to delete it
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    console.log(params);
    
    params.set('page', '1'); // when user types a new search query, we want to reset the page number to 1

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
