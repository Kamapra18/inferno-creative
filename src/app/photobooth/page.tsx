import { events } from "@/data/events";
import BrandCard from "@/components/layout/BrandCard";
import EventAccordion from "@/components/layout/EventAccordion";

export default function Page() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: "var(--color-background-down)",
      }}>
      <div
        className="relative w-full max-w-sm rounded-[38px] overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}>
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top, rgba(201,168,76,0.12), transparent 45%)",
          }}
        />

        <div className="relative z-10">
          <BrandCard />

          <div className="px-5 pb-6 flex flex-col gap-4">
            {events.map((event) => (
              <EventAccordion key={event.slug} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
