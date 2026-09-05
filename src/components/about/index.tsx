"use client";

import { PageHeader, PageShell, SectionCard } from "@/components/ui/page-shell";
import { Image, Link } from "@heroui/react";
import {
  BarChart3,
  Boxes,
  Factory,
  Info,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Production Management",
    text: "Track wax production from raw materials to finished goods.",
    icon: Factory,
  },
  {
    title: "Inventory Control",
    text: "Monitor stock levels, avoid shortages, and keep supply healthy.",
    icon: Boxes,
  },
  {
    title: "Order & Sales",
    text: "Process customer orders and manage sales transactions smoothly.",
    icon: BarChart3,
  },
  {
    title: "Quality Assurance",
    text: "Follow industry best practices for consistent wax quality.",
    icon: ShieldCheck,
  },
];

const About = () => {
  return (
    <PageShell>
      <PageHeader
        icon={Info}
        title="About WaxCraft"
        description="A modern workspace for wax manufacturing and distribution."
      />

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <Image
            alt="Priority"
            src="/prioritySolutionLogo.png"
            className="aspect-square w-[240px] md:w-[360px] lg:w-[460px]"
          />
        </div>

        <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SectionCard className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Who we are</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              WaxCraft is built for manufacturers and distributors who need a
              clean, reliable way to manage production, inventory, and sales.
              Whether you run a small workshop or a larger operation, the
              platform is designed to keep everyday work simple.
            </p>
          </SectionCard>

          <SectionCard className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Our mission</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Empower wax businesses with a smart, intuitive, and
              technology-driven platform that simplifies workflow, improves
              quality control, and keeps operations organized.
            </p>
          </SectionCard>

          <SectionCard className="p-5 sm:p-6 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Key features
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-black/[0.06] bg-[#F7F5F3]/70 p-4"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard className="p-5 sm:p-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Get started today
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use WaxCraft to handle production, inventory, orders, and
                  reports from one place — with a layout that works on desktop,
                  tablet, and mobile.
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Contact us
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mobile: 7044091077 / 7384671805
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Website:{" "}
                  <Link
                    isExternal
                    target="_blank"
                    href="https://prioritysolutions.in"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    prioritysolutions.in
                  </Link>
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
};
export default About;
