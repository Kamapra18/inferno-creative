import Image from "next/image";

export default function FooterLogo() {
  return (
    <div>
      <Image src="/logo/Asset-3.png" alt="logo" width={100} height={100} />
      <p className="mt-2" style={{ color: "var(--color-foreground)" }}>
        Bersama menciptakan karya digital yang bermakna.
      </p>
    </div>
  );
}
