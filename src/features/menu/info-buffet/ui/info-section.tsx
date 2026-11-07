import { QrCode } from "@/components/qr-code/gr-code";
import { InfoDisplay } from "@/features/menu/info-buffet/ui/info-display";
import { SECTIONS } from "@/features/menu/menu-daily/model/constants";
import { MenuDailyItem } from "@/features/menu/menu-daily/model/schema";

const DESSERT_ROWS = [
  {
    ro: "Asortiment de prăjituri și fructe",
    en: "Assorted pastries and fruits",
  },
  {
    ro: "Băuturi nealcoolice reci și calde, snacks",
    en: "Cold and hot soft drinks, snacks",
  },
];

const BUFFET_PRICE = {
  ro: "Meniu complet bufet",
  en: "Full buffet menu",
  price: "180 lei",
};

export default function InfoSection({
  category,
  items,
  qrUrl,
}: {
  category: (typeof SECTIONS)[number] | null;
  items: MenuDailyItem[] | null;
  qrUrl?: string;
}) {
  return (
    <div className="flex flex-col justify-between pb-2 print:pb-6!">
      <p
        className="text-center text-[14px] tracking-[0.18em] text-[#9a8060] uppercase print:my-3!"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        — {category ? category : "Section"} —
      </p>

      {category !== "deserturi" &&
        items?.map((item, idx) => <InfoDisplay key={idx} item={item} />)}

      {category === "deserturi" && (
        <div className="flex flex-col items-center justify-between gap-2 print:gap-6!">
          <div className="flex flex-1 flex-col gap-2 text-center">
            {DESSERT_ROWS.map((row) => (
              <div key={row.ro}>
                <p className="mb-1 font-['Cormorant_Garamond'] text-[26px] leading-tight font-semibold text-[#2c1f0e]">
                  {row.ro}
                </p>
                <p className="min-h-4 font-['Cormorant_Garamond'] text-[14px] font-light text-[#7a6242] italic">
                  {row.en}
                </p>
              </div>
            ))}
          </div>

          {qrUrl && <QrCode value={qrUrl} />}

          <div className="grid w-full grid-cols-3 items-center gap-3 print:pt-3!">
            <p className="px-2 text-center font-['Cormorant_Garamond'] text-[14px] tracking-[0.18em] text-[#9a8060] uppercase">
              {BUFFET_PRICE.ro}
            </p>
            <p className="text-center font-['Cormorant_Garamond'] text-[24px] leading-none font-bold text-[#2c1f0e]">
              {BUFFET_PRICE.price}
            </p>
            <p className="px-2 text-center font-['Cormorant_Garamond'] text-[14px] tracking-[0.18em] text-[#9a8060] uppercase">
              {BUFFET_PRICE.en}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
