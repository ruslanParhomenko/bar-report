export default function EmptyPage({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center w-screen h-[80vh] text-rd font-bold">
      select an {name}
    </div>
  );
}
