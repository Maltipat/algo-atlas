import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { companies, companiesBySlug } from "@/data/companies";
import { CompanyView } from "./company-view";

export function generateStaticParams() {
  return companies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${companiesBySlug[slug]?.name ?? "Company"} interview prep` };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!companiesBySlug[slug]) notFound();
  return <CompanyView slug={slug} />;
}
