import { Skeleton } from "@/components/ui/skeleton";
import { FC, ReactElement } from "react";

const Loading: FC = (): ReactElement => {
  return (
    <div className="flex w-full gap-x-4 items-center   py-4 px-8">
      <Skeleton className="size-14 rounded-full" />
      <div className="flex flex-col gap-y-1 w-full">
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-1/5 h-4" />
      </div>
    </div>
  );
};
export default Loading;
