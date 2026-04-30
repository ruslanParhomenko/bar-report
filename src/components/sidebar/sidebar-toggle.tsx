// "use client";

// import { useSidebar } from "@/components/ui/sidebar";
// import { useSwipeable } from "react-swipeable";

// export function SidebarToggleButton() {
//   const { toggleSidebar, isMobile } = useSidebar();

//   const handlers = useSwipeable({
//     onSwipedRight: (eventData) => {
//       const screenWidth = window.innerWidth;

//       const startX = eventData.initial[0];
//       const deltaX = eventData.deltaX;

//       const startZoneMin = screenWidth * 0.3;
//       const startZoneMax = screenWidth * 0.6;

//       const isFromCenter = startX > startZoneMin && startX < startZoneMax;

//       const isShortSwipe = deltaX > 40 && deltaX < 120;

//       if (isFromCenter && isShortSwipe) {
//         toggleSidebar();
//       }
//     },

//     trackTouch: true,
//     trackMouse: false,
//     preventScrollOnSwipe: false,
//   });

//   if (!isMobile) return null;

//   return <div {...handlers} className="fixed inset-0 z-0" />;
// }
