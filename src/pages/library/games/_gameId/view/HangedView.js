import React, { useState } from "reactn";
import { useRouter } from "next/router";
import { HangedMan } from "./HangedMan";
import { Alphabet } from "./Alphabet";
import { tildes } from "../../../../../components/common/DataList";
import { useEffect } from "react";
import { firestoreHanged } from "../../../../../firebase";
import { spinLoader } from "../../../../../components/common/loader";
import { GuessPhrase } from "./GuessPhrase";
import every from "lodash/every";
import includes from "lodash/includes";

export const HangedView = (props) => {
  const router = useRouter();
  const { gameId } = router.query;

  const [lettersPressed, setLettersPressed] = useState({});
  const [phrases, setPhrases] = useState(["prueba", "Harry Potter"]);
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [state, setState] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    const fetchGame = async () => {
      const gameRef = await firestoreHanged.collection("games").doc(gameId).get();

      const game = gameRef.data();

      if (game.phrases) setPhrases(game.phrases);

      setLoading(false);
    };

    fetchGame();
  }, []);

  const hangedMan = {
    head: "active",
    leftArm: "active",
    leftLeg: "active",
    rightArm: "active",
    rightLeg: "active",
    trunk: "active",
  };

  const phraseIsGuessed = (letters, phrase) => every(phrase, (letter) => includes(letters, letter));

  const onNewLetterPressed = (letter) => {
    const [lettersMatched, isMatched] = hasMatch(currentPhrase, letter);

    let state = state;

    // check if isMatched and if the phrase was guessed
    if (
      isMatched &&
      phraseIsGuessed(
        [...Object.keys(lettersPressed), ...lettersMatched],
        currentPhrase.toUpperCase().replace(/ /g, "")
      )
    )
      state = "GUESSED";

    const lettersPressedUpdate = lettersMatched.reduce(
      (acc, char) => ({ [char]: isMatched ? "matched" : "unmatched", ...acc }),
      {}
    );

    setState(state);
    setLettersPressed({ ...lettersPressed, ...lettersPressedUpdate });
  };

  const hasMatch = (phrase, letter_) => {
    const letter = letter_.toUpperCase();
    const tildeChar = tildes[letter]?.toUpperCase();

    const isMatch = phrase.toUpperCase().includes(letter);
    if (isMatch) return [tildeChar ? [letter, tildeChar] : [letter], true];

    return tildeChar ? [[letter, tildeChar], phrase.toUpperCase().includes(tildeChar)] : [[letter], false];
  };

  if (loading) return spinLoader();

  return (
    <div className="w-full bg-cover bg-no-repeat bg-secondary bg-pattern">
      <div className="grid gap-4 m-2 p-2 bg-[#221545] rounded-[4px] bg-opacity-50 md:m-8 md:p-8 md:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col items-center justify-center md:justify-start md:items-start">
          <div className="text-['Lato'] font-bold text-[15px] leading-[18px] my-4 text-whiteDark">
            Ahorcado (vista previa)
          </div>
          <div>
            <HangedMan {...props} hangedMan={hangedMan} />
          </div>

          <GuessPhrase {...props} lettersPressed={lettersPressed} phrase={currentPhrase} />

          <div className="max-w-[700px] mx-auto pb-8 relative">
            <Alphabet
              {...props}
              lettersPressed={lettersPressed}
              onLetterPressed={(letter) => onNewLetterPressed(letter)}
            />
          </div>
        </div>
        <div>
          <div className="text-['Lato'] font-bold text-[15px] leading-[18px] my-4 text-whiteDark">
            Palabras (selecciona una para probar):
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {phrases.map((phrase, index) => (
              <div
                className={`rounded-[4px] py-2 px-4 ${
                  currentPhrase === phrase ? "text-blackDarken" : "text-white"
                } text-['Lato'] text-[15px] leading-[18px] font-bold cursor-pointer ${
                  currentPhrase === phrase ? "bg-success" : "bg-primary"
                }`}
                key={`phrase-${index}`}
                onClick={() => {
                  setCurrentPhrase(phrase);
                  setLettersPressed({});
                }}
              >
                {phrase}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
