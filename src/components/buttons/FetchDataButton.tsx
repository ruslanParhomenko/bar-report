import { Button } from "@/components/ui/button";

export const FetchDataButton = ({
  fetchData,
  isDisabled,
}: {
  fetchData?: () => void;
  isDisabled?: boolean;
}) => {
  return (
    <>
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
    </>
  );
};
