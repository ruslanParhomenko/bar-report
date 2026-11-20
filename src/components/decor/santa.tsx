"use client";

import { useShowAnimation } from "@/providers/show-animation";

export default function SantaSleigh() {
  const { isShow } = useShowAnimation();

  if (!isShow) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 100" className="santa-sleigh" fill="none">
        <g className="santa-body">
          {/* Олень 1 */}
          <g className="reindeer">
            <path
              d="M35 48 Q28 39 23 29 M29 38 L19 31 M27 35 L31 25
               M35 48 L42 55 L38 68 M42 55 L48 66
               M35 48 L25 55 L23 67 M25 55 L18 64"
              stroke="#8B542E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M35 48 Q40 39 47 42 L53 47 L47 52 L39 51"
              fill="#A96B3D"
              stroke="#75401F"
              strokeWidth="1"
            />
            <circle cx="49" cy="46" r="2" fill="#E31B23" />
            <path
              d="M46 42 L49 34 L54 30 M46 42 L42 33 L43 27"
              stroke="#8B542E"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M38 49 L36 62 M45 52 L46 65"
              stroke="#75401F"
              strokeWidth="1.5"
            />
          </g>

          {/* Олень 2 */}
          <g className="reindeer reindeer--second">
            <path
              d="M75 48 Q68 39 63 29 M69 38 L59 31 M67 35 L71 25
               M75 48 L82 55 L78 68 M82 55 L88 66
               M75 48 L65 55 L63 67 M65 55 L58 64"
              stroke="#8B542E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M75 48 Q80 39 87 42 L93 47 L87 52 L79 51"
              fill="#A96B3D"
              stroke="#75401F"
              strokeWidth="1"
            />
            <circle cx="89" cy="46" r="2" fill="#E31B23" />
            <path
              d="M86 42 L89 34 L94 30 M86 42 L82 33 L83 27"
              stroke="#8B542E"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M78 49 L76 62 M85 52 L86 65"
              stroke="#75401F"
              strokeWidth="1.5"
            />
          </g>

          {/* Поводья */}
          <path
            d="M52 49 Q63 57 75 49 M92 49 Q105 42 115 48"
            stroke="#C49A52"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Сани */}
          <g>
            <path
              d="M108 55 L116 68 Q138 77 168 67 L181 55"
              stroke="#D4A13D"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M111 53 Q133 61 171 54 L164 68 L121 68 Z"
              fill="#B51E2B"
              stroke="#8C1420"
              strokeWidth="1.5"
            />
            <path
              d="M118 54 L123 43 Q144 37 163 45 L171 54"
              fill="#D52B32"
              stroke="#8C1420"
              strokeWidth="1.5"
            />
            <path
              d="M123 43 L127 39 L163 41 L167 46"
              stroke="#F5CF76"
              strokeWidth="2"
            />
            <path
              d="M111 69 Q135 81 170 69 Q179 65 184 68"
              stroke="#E7C16B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M119 55 L119 65 M165 53 L165 65"
              stroke="#F5CF76"
              strokeWidth="2"
            />
          </g>

          {/* Дед Мороз */}
          <g>
            {/* Тело */}
            <path
              d="M132 43 Q130 29 141 26 Q153 25 158 42 L155 58 L132 58 Z"
              fill="#C91F2C"
              stroke="#861522"
              strokeWidth="1.5"
            />

            {/* Мех на костюме */}
            <path
              d="M132 56 Q144 61 157 56"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path d="M140 29 L141 55" stroke="#F5D8B9" strokeWidth="2" />

            {/* Голова */}
            <circle cx="144" cy="22" r="10" fill="#F1C49C" />

            {/* Борода */}
            <path
              d="M135 25 Q131 34 143 39 Q155 34 153 25
               Q149 31 144 30 Q139 31 135 25"
              fill="white"
              stroke="#DDD"
              strokeWidth="0.7"
            />

            {/* Лицо */}
            <circle cx="147" cy="21" r="1" fill="#333" />
            <circle cx="138" cy="21" r="1" fill="#333" />
            <path d="M141 25 Q144 27 147 25" stroke="#B76A55" strokeWidth="1" />

            {/* Шапка */}
            <path
              d="M134 16 Q137 2 150 10 L156 17 Z"
              fill="#C91F2C"
              stroke="#861522"
              strokeWidth="1"
            />
            <path
              d="M133 16 Q145 12 156 18"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="151" cy="8" r="3" fill="white" />

            {/* Рука */}
            <path
              d="M153 34 L163 40"
              stroke="#C91F2C"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="164" cy="41" r="3" fill="#F1C49C" />
          </g>
        </g>
      </svg>
    </div>
  );
}
