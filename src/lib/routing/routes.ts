import type { Locale } from "@/config/locales";

const routes = (lang: Locale) => ({
  home: `/${lang}`,
  services: `/${lang}/services`,
  service: (slug: string) => `/${lang}/services/${slug}`,
  booking: `/${lang}/booking`,
  contacts: `/${lang}/contacts`,
  login: `/${lang}/login`,
  admin: `/${lang}/admin`,
  adminBookings: `/${lang}/admin/bookings`,
  adminServices: `/${lang}/admin/services`,
  adminReviews: `/${lang}/admin/reviews`,
  adminContacts: `/${lang}/admin/contacts`,
});

export default routes;
