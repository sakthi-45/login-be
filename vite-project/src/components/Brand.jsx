import fishImage from "../assets/fish.jpg";

const Brand = () => {
  return (
    <div className="flex flex-col justify-center px-2 text-white">

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 text-3xl shadow-[0_0_25px_rgba(0,150,255,0.3)]">
        🐟
      </div>

      <h1 className="font-serif text-4xl tracking-[5px] md:text-5xl">
        AQUA WORLD
      </h1>

      <p className="mt-2 text-sm tracking-wide text-cyan-300 md:text-base">
        Explore. Relax. Connect.
      </p>

      <div className="relative mt-8 w-full max-w-[520px] overflow-hidden rounded-2xl border border-cyan-300/20 bg-cyan-950/35 shadow-[0_16px_35px_rgba(0,0,0,0.2)]">
        <img
          src={fishImage}
          alt="Colorful fish swimming around coral underwater"
          className="aspect-[16/9] w-full object-cover opacity-45 mix-blend-screen saturate-50"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-950/35 via-slate-950/20 to-cyan-300/10" />
      </div>

      <div className="mt-8">
        <div className="text-sm leading-6 text-gray-200">
          <h1 className="font-serif text-3xl font-bold text-white">The ocean is a world of wonder</h1>
        </div>

        <span className="mt-2 block text-xl text-cyan-400">
          – Jacques Cousteau
        </span>
      </div>

    </div>
  );
};

export default Brand;