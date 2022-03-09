import React, { useState } from "reactn";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { firestoreTrivia } from "../../../../../firebase";
import { spinLoader } from "../../../../../components/common/loader";
import { snapshotToArray } from "../../../../../utils";

export const TriviaView = (props) => {
  const router = useRouter();
  const { gameId } = router.query;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = () =>
      firestoreTrivia
        .collection("games")
        .doc(gameId)
        .collection("questions")
        .onSnapshot((questionsSnapshot) => {
          const questions = snapshotToArray(questionsSnapshot);
          setQuestions(questions);
          setLoading(false);
        });

    fetchQuestions();
  }, [props.game]);


  if (loading) return spinLoader();

  return (
    <div className="w-full bg-cover bg-no-repeat bg-secondary bg-pattern">
      <div className="grid gap-4 m-2 p-2 bg-[#221545] rounded-[4px] bg-opacity-50 md:m-8 md:p-8">

        <div className="flex flex-col items-center justify-center md:justify-start md:items-start">
          <div className="text-['Lato'] font-bold text-[15px] leading-[18px] my-4 text-whiteDark">
            Ahorcado (vista previa)
          </div>
        </div>

      </div>
    </div>
  );
};
