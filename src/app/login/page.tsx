import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Login",
  description: "Vertex manufacturer portal login.",
};

export default function LoginPage() {
  return (
    <>
      <PageHeader
        title="Login"
        lede="Access your Vertex intelligence portal."
      />

      <section className="container py-12 lg:py-20">
        <div className="mx-auto max-w-md rounded-lg border border-vx-400/30 bg-vx-100/40 p-8 shadow-sm">
          <form className="space-y-4" action="#">
            <div>
              <label className="block text-small font-medium text-vx-900 mb-1.5" htmlFor="email">
                Work Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="w-full rounded-sm border border-vx-400/60 bg-white px-3.5 py-2 text-small text-vx-900 placeholder:text-vx-400 focus:border-vx-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-vx-900 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-sm border border-vx-400/60 bg-white px-3.5 py-2 text-small text-vx-900 placeholder:text-vx-400 focus:border-vx-800 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-sm bg-vx-900 px-4 py-2.5 text-small font-medium text-white transition-colors hover:bg-vx-800"
            >
              Sign In
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
