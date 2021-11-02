import React, {useMemo} from "reactn";
import styled from "styled-components";
import {useRouter} from "next/router";
import {Image} from "../../../components/common/Image";
import {Footer} from "../../../components/Footer";
import {useCasesData} from "..";
import {Navbar} from "../../home/Navbar";

// TODO: Should be maned HeldEventDetails.
export const UseCaseDetail = (props) => {
  const router = useRouter();
  const { heldEventId } = router.query;

  const currentHeldEvent = useMemo(() => {
    if (!heldEventId) return {};

    // TODO: It should be called "heldEvents" or "heldEventsData" [as parent folder] not useCasesData.
    return useCasesData.find((useCaseData) => useCaseData.id === heldEventId);
  }, [heldEventId]);

  return (
    <UseCaseDetailStyled>
      <Navbar />

      <div className="main-container">
        <div className="title-container">
          <h1>{currentHeldEvent.title}</h1>
        </div>
        <div className="image-container">
          <Image width="200px" height="100px" src={currentHeldEvent.imageUrl} />
        </div>
        <div class="text-container">
          <p>{currentHeldEvent.text}</p>
        </div>
      </div>

      <Footer />
    </UseCaseDetailStyled>
  );
};

// TODO: Should be maned HeldEventDetailsStyled.
const UseCaseDetailStyled = styled.section`
  .title-container {
    background: ${(props) => props.theme.basic.secondary};
    padding: 66px 0;
    text-align: center;

    h1 {
      color: ${(props) => props.theme.basic.whiteLight};
      font-family: Lato, sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 22px;
      line-height: 26px;
      letter-spacing: 0.03em;
    }
  }

  .image-container {
    margin-top: -36px;
    margin-bottom: 36px;
  }
  .text-container {
    margin: 0 2rem 4rem 2rem;
  }
`;
