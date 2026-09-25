import { Gem, Palette, Ruler, Clock3 } from "lucide-react";
import brand from "../../config/brand";

const benefits = [
  {
    icon: Gem,
    title: "Premium Fabrics",
    description: "Carefully selected materials for a refined finish.",
  },
  {
    icon: Palette,
    title: "Custom Designs",
    description: "Every piece is designed around your personal style.",
  },
  {
    icon: Ruler,
    title: "Perfect Fit",
    description: "Precisely tailored to your measurements and shape.",
  },
  {
    icon: Clock3,
    title: "On-Time Delivery",
    description: "Your outfit is completed with care and delivered on time.",
  },
];

function Benefits() {
  return (
    <section
      className="border-b border-black/10"
      style={{ backgroundColor: brand.colors.background }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid divide-y divide-black/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-black/10">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="flex items-start gap-4 px-0 py-7 sm:px-6 lg:px-7 lg:py-8"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white"
                  style={{ borderColor: `${brand.colors.accent}80` }}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    style={{ color: brand.colors.accent }}
                  />
                </div>

                <div>
                  <h3
                    className="text-xs font-semibold uppercase tracking-[0.12em]"
                    style={{ color: brand.colors.primary }}
                  >
                    {benefit.title}
                  </h3>

                  <p
                    className="mt-2 text-xs leading-5 opacity-50"
                    style={{ color: brand.colors.primary }}
                  >
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Benefits;
