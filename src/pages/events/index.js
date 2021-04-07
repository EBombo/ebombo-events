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

    return <LandingContainer>
        <HeaderLanding/>
        <Companies events={events}/>
        <Services/>
        <IntegrationGames events={events}
                          deleteElement={deleteElement}/>
        <EsportsGames/>
        <Specials events={events}/>
        <BusinessExamples events={events}
                          deleteElement={deleteElement}/>
        <HeldEvents events={events}
                    deleteElement={deleteElement}/>
        <Comments events={events}
                  deleteElement={deleteElement}/>
        <Contact/>
        <FooterSection>
            <ThemeProvider
                theme={{basic: {...darkTheme.basic, ...darkTheme.events}}}
            >
                <Footer marginLeft={"0"}/>
            </ThemeProvider>
        </FooterSection>
    </LandingContainer>;
};

const LandingContainer = styled.div`
  width: 100%;
  background: linear-gradient(
    180deg,
    #030005 0%,
    #10002b 9.9%,
    #100045 46.35%,
    #0e0063 100%
  );
`;

const FooterSection = styled.section`
  width: 100%;
`;
