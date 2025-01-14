import NextImage from "next/image";
import Link from "next/link";

export const BlobscanLogo: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <Link href="/">
    <NextImage
      className={`block dark:hidden ${className}`}
      src = "/logo-light.png"
      width="0"
      height="0"
      sizes="100vw"
      priority
      alt="dillscan-logo"
    />
    <NextImage
      className={`hidden dark:block ${className}`}
      src="/logo-dark.png"
      width="0"
      height="0"
      sizes="100vw"
      priority
      alt="dillscan-logo"
    />
  </Link>
);
