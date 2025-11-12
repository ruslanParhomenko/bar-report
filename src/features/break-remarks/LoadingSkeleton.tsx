import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeletonBreak() {
  const skeletonItems = Array(6).fill("");
  return (
    <>
      <div className="flex flex-col gap-4 py-10">
        {skeletonItems.map((_, index) => (
          <div key={index} className="flex gap-2 w-full ">
            <Skeleton className="h-10 w-[20%]" />
            <Skeleton className="h-10 w-[80%]" />
          </div>
        ))}
      </div>
      <div className="flex justify-between gap-5 py-10">
        <Skeleton className="h-12 w-[30%]" />
        <Skeleton className="h-12 w-[10%]" />
        <Skeleton className="h-12 w-[10%]" />
        <Skeleton className="h-12 w-[20%]" />
        <Skeleton className="h-12 w-[50%]" />
        <Skeleton className="h-12 w-[20%]" />
      </div>
    </>
  );
}
