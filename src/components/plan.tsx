import { PricingTable } from "@clerk/nextjs"

const Plan = () => {
  return (
    <div id="plans" className="mx-auto my-25 w-full max-w-7xl px-5">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Choose the right plan for you
        </h2>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          Get the AI tools you need to create faster, work smarter, and bring
          your ideas to life.
        </p>
      </div>
      <div className="mt-14 rounded-[2rem] border border-white/60 bg-white/20 p-3 shadow-[0_24px_70px_rgba(31,41,55,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl sm:p-5">
        <PricingTable
          appearance={{
            variables: {
              colorPrimary: "#334155",
              colorBackground: "rgba(255, 255, 255, 0.3)",
              colorNeutral: "#64748b",
              borderRadius: "1.25rem",
            },
            elements: {
              pricingTable: "grid grid-cols-1 gap-5 lg:grid-cols-3",
              pricingTableCard:
                "min-w-0 border border-white/60 bg-white/30 shadow-[0_16px_40px_rgba(31,41,55,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl",
              pricingTableCardHeader: "bg-white/15 border-b border-white/40",
              pricingTableCardBody: "bg-transparent",
              pricingTableCardFooter: "bg-transparent border-t border-white/40",
            },
          }}
        />
      </div>
    </div>
  )
}

export default Plan