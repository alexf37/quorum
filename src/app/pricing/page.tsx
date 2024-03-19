import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Basic",
    id: "tier-basic",
    href: "/dashboard",
    priceMonthly: "Free",
    description:
      "The essentials for having an engaging, live polling experience.",
    features: [
      "Up to 5 classes",
      "Up to 450 students",
      "Advanced class analytics",
      "48-hour support response time",
    ],
    mostPopular: false,
  },
  {
    name: "Professional",
    id: "tier-professional",
    href: "#",
    priceMonthly: "$11.99",
    description:
      "Unlock AI and unlimited class sizes for better insights in bigger classrooms.",
    features: [
      "Unlimited classes",
      "Unlimited students",
      "Built-in AI analysis",
      "24-hour support response time",
    ],
    mostPopular: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    priceMonthly: "Contact Us",
    description:
      "Dedicated support and feature development for your organization.",
    features: [
      "Everything from the previous tiers",
      "Custom branding and integrations",
      "Enterprise security measures",
      "1-hour, dedicated support response time",
    ],
    mostPopular: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <div className="relative overflow-visible py-24 sm:py-32">
      <svg
        className="absolute bottom-0 left-0 -z-10 h-full w-full stroke-border [mask-image:radial-gradient(70%_70%_at_left,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="grid-pattern"
            width={150}
            height={150}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#grid-pattern)"
        />
      </svg>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Pricing plans for all budgets
          </h2>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg leading-8 text-muted-foreground">
          Boost engagement in the classroom and give everyone a voice with the
          plan that&apos;s right for you.
        </p>
        <div className="isolate mx-auto mt-14 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular
                  ? "shadow-2xl lg:z-10 lg:rounded-b-none"
                  : "lg:mt-8",
                tierIdx === 0 ? "lg:rounded-r-none" : "",
                tierIdx === tiers.length - 1 ? "lg:rounded-l-none" : "",
                "flex flex-col justify-between rounded-3xl border border-border bg-primary-foreground p-8 xl:p-10",
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={classNames(
                      tier.mostPopular
                        ? "text-accent-foreground"
                        : "text-muted-foreground",
                      "text-lg font-semibold leading-8",
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-accent-foreground">
                      Recommended
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-primary">
                    {tier.priceMonthly}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    {tier.priceMonthly !== "Free" &&
                      tier.priceMonthly !== "Contact Us" &&
                      "/mo"}
                  </span>
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                >
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-x-3 text-muted-foreground"
                    >
                      <Check className="h-6 w-5 flex-none" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                passHref
                className="mt-8 cursor-not-allowed"
                href={tier.href}
              >
                <Button
                  aria-describedby={tier.id}
                  disabled={
                    tier.id === "tier-professional" ||
                    tier.id === "tier-enterprise"
                  }
                  className="w-full"
                  variant={tier.mostPopular ? "default" : "secondary"}
                >
                  {tier.id === "tier-basic" && "Get started"}
                  {tier.id === "tier-professional" && "Coming soon"}
                  {tier.id === "tier-enterprise" && "Coming soon"}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
