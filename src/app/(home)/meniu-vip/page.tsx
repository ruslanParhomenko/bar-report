import ButtonStartMeniu from "@/components/meniu/ButtonStartMeniu";

export default function Home() {
  return (
    <div className={" flex flex-col  items-center gap-14  pt-40 "}>
      <ButtonStartMeniu page={`/meniu-vip/bar`} text={"bar"} />
      <ButtonStartMeniu page={`/meniu-vip/cusine`} text={"cusine"} />
      <ButtonStartMeniu page={`/meniu-vip/daily-meniu`} text={"Daily Menu"} />
      <ButtonStartMeniu page={`/meniu-vip/staff-menu`} text={"Staff Menu"} />
    </div>
  );
}
