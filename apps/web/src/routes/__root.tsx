import { Toaster } from '@/components/ui/sonner';

import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import appCss from '../index.css?url';
import Loader from '@/components/loader';
import type { QueryClient } from '@tanstack/react-query';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { AppSidebar } from '@/components/app-sidebar';

export interface RouterAppContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'My App',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: RootDocument,
});

function RootDocument() {
  const isFetching = useRouterState({ select: (s) => s.isLoading });

  return (
    <html lang='en' className='dark'>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className='grid h-svh grid-rows-[auto_1fr]'>
          {isFetching ? (
            <Loader />
          ) : (
            <SidebarProvider
              style={
                {
                  '--sidebar-width': 'calc(var(--spacing) * 72)',
                  '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
              }
            >
              <AppSidebar variant='inset' />
              <SidebarInset>
                <SiteHeader />
                <Outlet />
              </SidebarInset>
            </SidebarProvider>
          )}
        </div>
        <Toaster richColors />
        <TanStackRouterDevtools position='bottom-left' />
        <Scripts />
      </body>
    </html>
  );
}
