import { AuthBrand, AuthLayout, defaultAuthTestimonials } from "@estatify/ui";

/**
 * Single auth chrome for every Platform auth route.
 */
export default function PlatformAuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthLayout brand={<AuthBrand product="Platform" />} testimonials={defaultAuthTestimonials}>
      {children}
    </AuthLayout>
  );
}
