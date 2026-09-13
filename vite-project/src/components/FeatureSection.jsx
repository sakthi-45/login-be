const features = [
  {
    icon: "🐟",
    title: "Discover Marine Life",
    description:
      "Explore amazing aquatic species and habitats.",
  },
  {
    icon: "〰️",
    title: "Stay Relaxed",
    description:
      "Relax with the peaceful beauty of aquariums.",
  },
  {
    icon: "👥",
    title: "Join Our Community",
    description:
      "Connect with aquarium lovers around the world.",
  },
];

const FeatureSection = () => {
  return (
    <section className="mx-auto mt-10 grid max-w-5xl grid-cols-1 border-t border-slate-700/20 pt-7 md:grid-cols-3">

      {features.map((feature, index) => (
        <div
          key={index}
          className="border-slate-700/20 px-6 py-5 text-center md:border-r md:last:border-r-0"
        >

          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-lg">
            {feature.icon}
          </div>

          <h3 className="mt-3 text-sm font-medium text-white">
            {feature.title}
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            {feature.description}
          </p>

        </div>
      ))}

    </section>
  );
};

export default FeatureSection;