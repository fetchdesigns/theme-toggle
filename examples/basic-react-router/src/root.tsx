import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import { ThemeScript, getThemeFromCookie } from '@fetchdesigns/theme-toggle-react-router';
import Header from './components/Header';
import type { Route } from './+types/root';
import stylesHref from './app.css?url';

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesHref },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const theme = await getThemeFromCookie(request);
  return { theme };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export default function Root() {
  const { theme } = useLoaderData<typeof loader>();

  return (
    <html lang="en" data-theme={theme || undefined}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeScript />
      </head>
      <body>
        <Header theme={theme} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
