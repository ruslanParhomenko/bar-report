import { Dot } from "lucide-react";
import { LocalTranslateFn, MenuColumn } from "./types";

export function ColCover({ col, t }: { col: MenuColumn; t: LocalTranslateFn }) {
  return (
    <div className="flex h-full flex-col items-center justify-between py-8 pl-4">
      <div className="flex w-full flex-1 items-center justify-center gap-4">
        <Dot size={36} />

        <span className="pb-3 text-center leading-none font-bold tracking-widest text-[#1a1a1a] select-none md:text-6xl">
          {col.title ? t(col.title) : t("menu_title")}
        </span>

        <Dot size={36} />
      </div>

      {col.qrUrl && (
        <div className="flex items-center justify-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(
              col.qrUrl,
            )}&&color=180-180-180&bgcolor=255-255-255`}
            alt="QR"
            width={90}
            height={90}
            style={{
              imageRendering: "crisp-edges",
              transform: "translateZ(0)",
            }}
          />
        </div>
      )}
    </div>
  );
}
