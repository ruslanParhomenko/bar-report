import { Button } from "@/components/ui/button";

export const FetchDataButton = ({
  fetchData,
  isDisabled,
  className,
}: {
  fetchData?: () => void;
  isDisabled?: boolean;
  className?: string;
}) => {
  return (
    <div className={className}>
      {fetchData && (
        <Button
          type="button"
          variant="secondary"
          className="hover:bg-rd text-bl hover:text-black"
          onClick={() => fetchData?.()}
          disabled={isDisabled}
        >
          fetch data
        </Button>
      )}
    </div>
  );
};
