import React, {useEffect, useState} from "reactn";
import styled, {ThemeProvider} from "styled-components";
import {HeaderLanding} from "./HeaderLanding";
import {Services} from "./Services";
import {firestore} from "../../firebase";
import {IntegrationGames} from "./IntegrationGames";
import {EsportsGames} from "./EsportsGames";
import {Specials} from "./Specials";
import {BusinessExamples} from "./BusinessExamples";
import {HeldEvents} from "./HeldEvents";
import {Comments} from "./Comments";
import {Contact} from "./Contact";
import {Footer} from "../../components/Footer";
import {Companies} from "./Companies";
import get from "lodash/get";
import {spinLoader} from "../../utils";
import {darkTheme} from "../../styles/theme";

export default (props) => {
    const [events, setEvents] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLandingEvents();
    }, []);

    useEffect(() => {
        if (!loading) {
            fillCanvas();
        }
    }, [loading])

    const fillCanvas = () => {
        let canvas = document.getElementById("landing-canvas");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        let width = canvas.width;
        let height = canvas.height;
        let ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < 60; i++) {
            let x = Math.floor(Math.random() * width);
            let y = Math.floor(Math.random() * height);
            let radius = Math.floor(Math.random() * 20);

            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ",1)";
            ctx.fill();
            ctx.closePath();
        }
    }

    const fetchLandingEvents = () =>
        firestore
            .collection("landings")
            .doc("events")
            .onSnapshot((snapshot) => {
                setEvents(snapshot.data());
                setLoading(false);
            });

    const deleteElement = async (element, field) => {
        const newElements = get(events, `${field}`, []).filter(
            (ele) => ele.id !== element.id
        );

        await firestore.doc(`landings/events`).update({
            [field]: newElements,
        });
    };

    if (loading) return spinLoader();

    return (
        <LandingContainer>
            <HeaderLanding/>

            <Companies events={events} deleteElement={deleteElement}/>

            <Services/>

            <IntegrationGames events={events} deleteElement={deleteElement}/>

            <EsportsGames/>

            <Specials events={events}/>

            <BusinessExamples events={events} deleteElement={deleteElement}/>

            <HeldEvents events={events} deleteElement={deleteElement}/>

            <Comments events={events} deleteElement={deleteElement}/>

            <Contact/>

            <FooterSection>
                <ThemeProvider
                    theme={{basic: {...darkTheme.basic, ...darkTheme.events}}}
                >
                    <Footer marginLeft={"0"}/>
                </ThemeProvider>
            </FooterSection>

            <CanvasContainer id={"landing-canvas"}/>
        </LandingContainer>
    );
};

const LandingContainer = styled.div`
  width: 100%;
  background: linear-gradient(180deg,
  #030005 0%,
  #10002b 9.9%,
  #100045 46.35%,
  #0e0063 100%);
  position: relative;
`;

const CanvasContainer = styled.canvas`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`

const FooterSection = styled.section`
  width: 100%;
`;
