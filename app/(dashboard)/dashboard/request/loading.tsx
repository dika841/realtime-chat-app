import { Skeleton } from "@/components/ui/skeleton";
import { FC, ReactElement } from "react";

const Loading: FC = (): ReactElement => {
  return (
    <div className="w-full flex flex-col gap-3">
      <Skeleton className="mb-4 w-1/3 h-12" />
      <Skeleton className="mt-4  w-4/5 h-40 mx-auto" />
    </div>
  );
};

export default Loading;
