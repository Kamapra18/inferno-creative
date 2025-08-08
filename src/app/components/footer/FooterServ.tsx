export default function FooterServices() {
  return (
    <div>
      <h2 className="text-lg font-bold">Layanan Kami</h2>
      <ul className="mt-2 space-y-2 text-gray-400">
        {[
          { label: "Undangan Digital", href: "/#undangan" },
          { label: "Dokumentasi Foto", href: "/#foto" },
          { label: "Dokumentasi Video", href: "/#video" },
          { label: "Paket Lengkap Pernikahan", href: "/#paket-lengkap" },
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
