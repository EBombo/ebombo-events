import { useRouter } from "next/router";
import React from "reactn";

export const Release = (props) => {
  const router = useRouter();

  const { releaseId } = router.query;

  const documentId = useMemo(() => {
    return releaseId === "new" ? firestore.collection("events").doc().id : releaseId;
  }, [releaseId]);

  return (
    <div className="w-full flex flex-col items center bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8 h-[calc(100vh-50px)] overflow-auto">
      <div className="text-primary text-['Lato'] font-[700] text-[20px] leading-[24px] md:text-[44px] md:leading-[53px] tracking-[.03em]">
        Comunicado
      </div>

      <form action="">
        
      </form>
    </div>
  );
};
