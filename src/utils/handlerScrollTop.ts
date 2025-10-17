//scroll to top
export const handleScrollTop = ({ accordionRef }: { accordionRef: any }) => {
  setTimeout(() => {
    if (accordionRef.current) {
      const y =
        accordionRef.current.getBoundingClientRect().top + window.scrollY - 5;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, 350);
};
