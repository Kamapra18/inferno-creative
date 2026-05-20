import { events } from "@/data/events";
import EventAccordion from "@/components/layout/EventAccordion";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <EventAccordion event={event} />
    </div>
  );
}
