export default function FooterServices() {
  return (
    <div>
      <h2 className="text-lg font-bold">Layanan Kami</h2>
      <ul className="mt-2 space-y-2 text-gray-400">
        {[
          { label: "Home", href: "/" },
          { label: "Undangan", href: "/undangan-bali" },
          { label: "Dokumentasi Foto & Video", href: "/jasa-foto-video-bali" },
          { label: "Photobooth", href: "/photobooth-bali" },
        ].map((item) => (
          <li
            key={item.label}
            className="cursor-pointer transition-colors"
            style={{
              color: "var(--color-foreground)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-foreground)")
            }>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
