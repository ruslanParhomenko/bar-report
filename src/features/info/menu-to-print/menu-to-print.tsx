"use client";

import {
  MenuColumn,
  MenuDataType,
  MenuItem,
  MenuSection,
} from "@/app/actions/data-constants/data-menu-action";

import { OrnamentBorder } from "@/components/wrapper/ornament-border";
import { Dot, PrinterIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { LOCAL_TRANSLATIONS } from "./constants";

type LocalTranslateFn = (key: string) => string;

function Row({ item, t }: { item: MenuItem; t: LocalTranslateFn }) {
  if (!item.name && !item.price) return null;

  return (
    <div className="my-0 grid grid-cols-[2fr_1fr_auto] items-baseline gap-3 text-xs tracking-wider text-[#1a1a1a] print:my-1.5">
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {item.name ? t(item.name) : ""}
      </span>

      <span
        className="shrink-0 whitespace-nowrap text-[#777]"
        style={{ fontSize: "0.56rem" }}
      >
        {item.weight}
      </span>

      {item.price != null && (
        <span className="w-6 shrink-0 text-left font-semibold">
          {item.price}
        </span>
      )}
    </div>
  );
}

function SectionTitle({ title, t }: { title: string; t: LocalTranslateFn }) {
  return (
    <h3 className="m-0 text-center font-bold tracking-widest text-[#1a1a1a] italic print:mt-2">
      · {t(title)} ·
    </h3>
  );
}

function Section({
  section,
  t,
}: {
  section: MenuSection;
  t: LocalTranslateFn;
}) {
  return (
    <div className="print:my-3">
      <SectionTitle title={section.title} t={t} />

      {section.items?.map((item, i) => (
        <Row key={i} item={item} t={t} />
      ))}

      {section.subgroups?.map((sg, i) => (
        <div key={i} className="mt-1">
          <p
            className="mb-px text-center font-bold tracking-wider text-[#1a1a1a] uppercase"
            style={{ fontSize: "0.55rem" }}
          >
            {sg.label}
          </p>

          {sg.items.map((item, j) => (
            <Row key={j} item={item} t={t} />
          ))}
        </div>
      ))}
    </div>
  );
}

function ColSingle({ col, t }: { col: MenuColumn; t: LocalTranslateFn }) {
  return (
    <div className="h-full px-1 pb-3">
      <h2
        className="text-center font-bold tracking-widest text-[#1a1a1a] uppercase"
        style={{ fontSize: "1rem" }}
      >
        {col.title ? t(col.title) : ""}
      </h2>

      {col.sections?.map((sec) => (
        <Section key={sec.id} section={sec} t={t} />
      ))}
    </div>
  );
}

function ColCover({ col, t }: { col: MenuColumn; t: LocalTranslateFn }) {
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

function SinglePage({
  page,
  label,
  t,
  isRtl,
}: {
  page: MenuDataType["pages"][0];
  label: string;
  t: LocalTranslateFn;
  isRtl: boolean;
}) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Menu — ${label}`,
    pageStyle: `
      @page { size: A4 portrait; margin: 0; }
      @media print {
        html, body { font-family: "Playfair Display", Georgia, serif !important }
        .print-root {
          width: 210mm !important;
          height: 288mm !important;
          padding: 4mm !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .no-print { display: none !important; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        img, svg { break-inside: avoid; }
      }
    `,
  });

  return (
    <div className="flex h-full flex-col">
      <div className="no-print flex shrink-0 px-2 py-1.5">
        <button onClick={() => handlePrint()} className="cursor-pointer">
          <PrinterIcon className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={printRef}
        dir={isRtl ? "rtl" : "ltr"}
        className="print-root flex min-h-0 flex-1 flex-col px-2 pb-2"
      >
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
          {page.columns.map((col, i) => {
            if (col.type === "cover") {
              return (
                <OrnamentBorder key={`${col.id}-${i}`}>
                  <ColCover key={col.id} col={col} t={t} />;
                </OrnamentBorder>
              );
            }

            return (
              <OrnamentBorder key={`${col.id}-${i}`}>
                <ColSingle col={col} t={t} />
              </OrnamentBorder>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MenuPage({ data }: { data: MenuDataType | null }) {
  const [currentLang, setCurrentLang] = useState<string>("ru");

  const globalT = useTranslations("Menu");

  if (!data) return null;

  const localT: LocalTranslateFn = (key: string) => {
    if (LOCAL_TRANSLATIONS[currentLang]?.[key]) {
      return LOCAL_TRANSLATIONS[currentLang][key];
    }
    try {
      return globalT(key);
    } catch {
      return key;
    }
  };

  const isRtl = currentLang === "he";

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
      />

      <div className="no-print flex justify-center gap-4">
        {["ru", "ro", "en", "he", "tr"].map((lang) => (
          <button
            key={lang}
            onClick={() => setCurrentLang(lang)}
            className={`cursor-pointer rounded px-1 text-sm uppercase transition-all ${
              currentLang === lang
                ? "bg-black font-bold text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div
        className="flex h-[86dvh] max-w-[90dvw]"
        style={{
          fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
        }}
      >
        {data.pages.map((page, i) => (
          <div
            key={page.id}
            className="flex w-1/2 flex-col border-r border-[#bfb09a] last:border-r-0"
          >
            <SinglePage
              page={page}
              label={i === 0 ? "Page 1" : "Page 2"}
              t={localT}
              isRtl={isRtl}
            />
          </div>
        ))}
      </div>
    </>
  );
}
