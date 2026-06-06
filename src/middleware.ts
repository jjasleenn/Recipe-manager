import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/recipes",
  "/recipes/:id",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (isPublicRoute(req)) {
    return;
  }

  if (!userId) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
