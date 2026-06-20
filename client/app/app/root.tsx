import "~/styles/global.css";
import { Scripts, Links, ScrollRestoration, Outlet } from "react-router";

import "root/src/i18n/i18n.ts";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/x-icon"
          href="/static/frontend/favicon.ico"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/frontend/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/frontend/favicon-32x32.png"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/static/frontend/apple-touch-icon.png"
        />

        <link rel="manifest" href="/static/frontend/site.webmanifest" />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
        <meta
          name="description"
          content="A demo version of a guest-house website"
        />

        <Links />
        <title>Shushan GH</title>
      </head>

      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
export default function Root() {
  return (
    <>
      <Outlet />
    </>
  );
}
