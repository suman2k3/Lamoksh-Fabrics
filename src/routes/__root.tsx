import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter } from "@tanstack/react-router";

import { ShopProvider } from "@/lib/shop-store";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { SearchDialog } from "@/components/site/SearchDialog";

function NotFoundComponent() {
  return (
    <div className="container-lux flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="display-lg mt-4">This page has been put away</h1>
      <p className="body-lux mt-4 max-w-md">
        The page you are looking for no longer exists. Return to the house, or browse the current
        collections.
      </p>
      <Link to="/" className="btn-lux mt-8">
        Return home
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="container-lux flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow">Something interrupted</p>
      <h1 className="display-md mt-4">This page didn't load</h1>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          className="btn-lux"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </button>
        <a href="/" className="nav-label link-underline self-center">
          Go home
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ShopProvider>
        <Header />
        <main>
          {/* Required: nested routes render here. */}
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
        <SearchDialog />
      </ShopProvider>
    </QueryClientProvider>
  );
}
