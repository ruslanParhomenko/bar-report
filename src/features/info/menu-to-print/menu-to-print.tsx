"use client";

import {
  MenuColumn,
  MenuDataType,
  MenuItem,
  MenuSection,
} from "@/app/actions/data-constants/data-menu-action";

import { Dot, PrinterIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { LOCAL_TRANSLATIONS } from "./constants";

type LocalTranslateFn = (key: string) => string;

function Row({ item, t }: { item: MenuItem; t: LocalTranslateFn }) {
  if (!item.name && !item.price) return null;

  return (
    <div className="my-1.5 grid grid-cols-[2fr_1fr_auto] items-baseline gap-3 text-xs tracking-wider text-[#1a1a1a]">
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
    <h3 className="mt-2 text-center font-bold tracking-widest text-[#1a1a1a] italic">
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
    <div className="my-3">
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
            {/* Если sg.label тоже нужно переводить, оберните в t(sg.label) */}
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
    <div className="h-full px-1">
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
    <div className="flex h-full flex-col items-center justify-between py-6 pl-4">
      <div className="flex w-full flex-1 items-center justify-center gap-4">
        <Dot size={36} />

        <span className="pb-3 text-center text-6xl leading-none font-bold tracking-widest text-[#1a1a1a] select-none">
          {col.title ? t(col.title) : t("menu_title")}
        </span>

        <Dot size={36} />
      </div>

      {col.qrUrl && (
        <div className="flex items-center justify-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(
              col.qrUrl,
            )}`}
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

function Ornament({ className = "" }: { className?: string }) {
  return (
    <img
      src="/2.svg"
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        imageRendering: "crisp-edges",
      }}
    />
  );
}

function OrnamentBorder({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="relative h-full w-full px-2 py-1">
        <Ornament className="top-0 left-0 h-10 w-10 -rotate-90" />
        <Ornament className="top-0 right-0 h-10 w-10" />
        <Ornament className="bottom-0 left-0 h-10 w-10 rotate-180" />
        <Ornament className="right-0 bottom-0 h-10 w-10 rotate-90" />

        <div className="relative z-10 h-full">{children}</div>
      </div>
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
          height: 297mm !important;
          padding: 4mm !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .print-inner { flex: 1 !important; min-height: 0 !important; height: 100% !important; width: 100% !important; }
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

      {/* Добавили dir={isRtl ? "rtl" : "ltr"} чтобы иврит отображался корректно справа налево */}
      <div
        ref={printRef}
        dir={isRtl ? "rtl" : "ltr"}
        className="print-root flex min-h-0 flex-1 flex-col px-2 pb-2"
      >
        <div className="print-inner min-h-0 flex-1">
          <div className="grid h-full grid-cols-2 gap-4">
            {page.columns.map((col, i) => {
              if (col.type === "cover") {
                return <ColCover key={col.id} col={col} t={t} />;
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

      {/* Панель переключения языков (не пойдет на печать благодаря классу no-print) */}
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
        className="flex max-w-[90dvw] overflow-auto"
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
