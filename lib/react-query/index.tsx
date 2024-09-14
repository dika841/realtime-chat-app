'use client'
import { FC, PropsWithChildren, ReactElement, useRef } from "react";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
export const QueryProvider:FC<PropsWithChildren> = ({ children }):ReactElement => {
    const queryClientRef = useRef<QueryClient>();
    if (!queryClientRef.current) {
        queryClientRef.current = new QueryClient({
            defaultOptions: {
                queries: {
                  staleTime: 10 * (60 * 1000),
                },
              },
        });
    }
    
    return <QueryClientProvider client={queryClientRef.current}>{children}</QueryClientProvider>
}
