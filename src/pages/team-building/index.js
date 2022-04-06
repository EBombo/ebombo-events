import React, { useRef } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Desktop } from "../../constants";
import { Icon } from "../../components/common/Icons";
import { config } from "../../firebase";
import { Image } from "../../components/common/Image";
import { ButtonAnt } from "../../components/form";
import { TeamBuildingLiterals } from "../../components/common/DataList";
import { Carousel } from "../../components/common/Carousel";

export const TeamBuilding = (props) => {
  const router = useRouter();

  const carouselRef = useRef(null);

  const goPrevious = () => {
    carouselRef.current.prev();
  };

  const goNext = () => {
    carouselRef.current.next();
  };

  const GameContentItem = ({ gameContent }) => (<div>
    <div className="text-white">
      <div className="aspect-square w-full mb-4"><img src={gameContent.img} alt="" /></div>
      <div className="text-2xl mb-4">{gameContent.title}</div>
      <p className="text-base">{gameContent.description}</p>
    </div>
  </div>);

  return (
    <div>
      <section className="bg-tapiz-1 bg-white md:h-[calc(100vh-100px)] flex flex-col justify-center pt-14 md:pt-0">
        <div className="grid md:grid-cols-[4fr_6fr] max-w-[1500px] mx-auto">
          <div className="px-8">
            <h3 className="text-primary font-bold text-3xl md:text-5xl">{TeamBuildingLiterals.header.subheading}</h3>
            <h2 className="text-secondary text-5xl md:text-7xl font-bold uppercase">{TeamBuildingLiterals.header.heading}</h2>
            <p className="text-secondary text-base md:text-2xl">{TeamBuildingLiterals.header.description}</p>
            <div className="hidden md:block">
              <ButtonAnt size="big" color="success"><span className="text-lg font-bold">Regístrate</span></ButtonAnt>
            </div>
          </div>

          <div className="px-8">
            <img
              src="https://via.placeholder.com/500x300"
              alt=""
              className="w-full aspect-video rounded-2xl"
            />
          </div>

          <div className="md:hidden px-8 py-8">
           <ButtonAnt size="big" color="success"><span className="text-lg font-bold">Regístrate</span></ButtonAnt>   
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary-to-secondary">
        <div className="max-w-[1500px] mx-auto py-8 px-8 grid md:grid-cols-[1fr_1fr]">
          <div className="grid grid-cols-[15px_auto] mb-8 mt-0 md:mt-8">
            <div className="bg-successLight"></div>
            <div className="text-white font-bold text-3xl md:text-7xl self-center px-8 md:px-12">{TeamBuildingLiterals.whyItWorks.title}</div>
          </div>

          <div>
            <div className="mb-6 text-white text-base md:text-2xl">{TeamBuildingLiterals.whyItWorks.description}</div>
            <div className="text-white text-base md:text-2xl">{TeamBuildingLiterals.whyItWorks.description2}</div>
          </div>
        </div>
      </section>

      <section className="bg-tapiz-1 bg-white">
        <div className="max-w-[1500px] mx-auto py-8 px-8 grid">
          <div className="max-w-[1200px] mx-auto mb-6 text-secondary text-center font-bold text-3xl md:text-7xl self-center px-8 md:px-12">{TeamBuildingLiterals.activities.title}</div>

          <div className="text-secondary text-base md:text-2xl text-center">{TeamBuildingLiterals.activities.description}</div>
        </div>
      </section>

      <section className="bg-gradient-primary-to-secondary">
        <div className="max-w-[1000px] md:mx-auto grid grid-cols-[min-content_auto_min-content] items-center mx-4 sm:mx-8">
          <div className="">
            <Icon
              type="left"
              style={{color: "#FFFFFF"}}
              className="p-2 bg-primary rounded-lg cursor-pointer"
              onClick={() => goPrevious() }
            />
          </div>
          <div className="max-w-[300px] md:max-w-[900px] mx-auto py-8 px-8">
            <Carousel
              hideIndicators
              ref={carouselRef}
              components={TeamBuildingLiterals.games.map((_, index) => (
              <div key={`carousel-wrapper-${index}`} className="grid grid-cols-[1fr] md:grid-cols-[1fr_1fr_1fr] gap-8">
                <GameContentItem gameContent={TeamBuildingLiterals.games[index % TeamBuildingLiterals.games.length]}/>

                <Desktop>
                  <>
                    <GameContentItem gameContent={TeamBuildingLiterals.games[(index + 1) % TeamBuildingLiterals.games.length]}/>

                    <GameContentItem gameContent={TeamBuildingLiterals.games[(index + 2) % TeamBuildingLiterals.games.length]}/>
                  </>
                </Desktop>
              </div>
            ))} />
          </div>
          <div className="">
            <Icon
              type="right"
              style={{color: "#FFFFFF"}}
              className="p-2 bg-primary rounded-lg cursor-pointer"
              onClick={() => goNext()} /> 
          </div>
        </div>
        
      </section>

      <section className="bg-tapiz-1 bg-white">
        <div className="max-w-[1500px] mx-auto py-8 px-8 grid">
          <div className="max-w-[1200px] mx-auto mb-6 uppercase text-secondary text-center font-bold text-3xl md:text-7xl self-center px-8 md:px-12">{TeamBuildingLiterals.virtualEvents.title}</div>

          <div className="my-8">
            {TeamBuildingLiterals.virtualEvents.items.reduce((acc, item, i) => {
              const isOdd = i%2 === 1;

              const childItems = [
                (<img key={`img-${i}`} src={item.img} alt="" className={`${isOdd ? "md:order-1" : "md:order-2"} w-full order-1 aspect-video`} />),
                (<div key={`content-${i}`} className={`${isOdd ? "md:order-2" : "md:order-1"} order-2`}>
                  <div className="mb-6 uppercase font-bold text-primary text-2xl md:text-3xl">{item.title}</div>
                  <div className="text-base md:text-2xl">{item.description}</div>
                </div>)
              ];

              const wrapperEl = (<div key={`wrapper-${i}`} className="grid md:grid-cols-[1fr_1fr] my-10 gap-10">{childItems}</div>);

              return [...acc, wrapperEl]; 
            }, [])}
          </div>
        </div>
      </section>

      <section className="bg-gradient-black-to-secondary">
        <div className="max-w-[1500px] mx-auto py-8 px-8">
          <div className="text-white font-bold text-3xl md:text-7xl">{TeamBuildingLiterals.virtualEventYouLove.title}</div>
          <div className="py-8">
           <ButtonAnt size="big" color="success"><span className="text-lg font-bold">Regístrate</span></ButtonAnt>   
          </div>
        </div>
      </section>
    </div>
  );
};

