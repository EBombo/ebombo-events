import React, {useEffect, useRef, useState} from "reactn";
import styled, {ThemeProvider} from "styled-components";
import {HeaderLanding} from "./HeaderLanding";
import {Services} from "./Services";
import {config, firestore} from "../../firebase";
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
import {Image} from "../../components/common/Image";

export default (props) => {
    const [events, setEvents] = useState(null);
    const [loading, setLoading] = useState(true);

    const contentLading = useRef(null);

    useEffect(() => {
        if (!contentLading.current) return;

        console.log("contentLading.current", contentLading.current)
        console.log("contentLading.current.clientHeight", contentLading.current.clientHeight)
        console.log("contentLading.current.offsetHeight", contentLading.current.offsetHeight)
        console.log("contentLading.current.style.height", contentLading.current.style.height)
        console.log("contentLading.current.height", contentLading.current.height)
        console.log("contentLading.current.getBoundingClientRect().height", contentLading.current.getBoundingClientRect().height)
    }, [contentLading.current]);

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

    return <LandingContainer imageHeight={get(document.getElementById("contenido"), "clientHeight")}>
        <div className="images">
            <Image src={config.storageUrl + "/resources/b2bLanding/1.png"}
                   position="relative"
                   height="auto"
                   width="100%"
                   size="cover"/>
            <Image src={config.storageUrl + "/resources/b2bLanding/2.png"}
                   position="relative"
                   height="auto"
                   width="100%"
                   size="cover"/>
            <Image src={config.storageUrl + "/resources/b2bLanding/3.png"}
                   position="relative"
                   height="auto"
                   width="100%"
                   size="cover"/>
            <Image src={config.storageUrl + "/resources/b2bLanding/4.png"}
                   position="relative"
                   height="auto"
                   width="100%"
                   size="cover"/>
            <Image src={config.storageUrl + "/resources/b2bLanding/5.png"}
                   position="relative"
                   height="auto"
                   width="100%"
                   size="cover"/>
            <Image src={config.storageUrl + "/resources/b2bLanding/6.png"}
                   position="relative"
                   height="auto"
                   width="100%"
                   size="cover"/>
            <Image src={config.storageUrl + "/resources/b2bLanding/7.png"}
                   position="relative"
                   height="auto"
                   width="100%"
                   size="cover"/>
            <Image src={config.storageUrl + "/resources/b2bLanding/8.png"}
                   position="relative"
                   height="auto"
                   width="100%"
                   size="cover"/>
            <Image src={config.storageUrl + "/resources/b2bLanding/9.png"}
                   position="relative"
                   height="auto"
                   width="100%"
                   size="cover"/>
        </div>
        <div ref={contentLading}
             id="contenido">
            <HeaderLanding/>
            <Companies/>
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
        </div>
    </LandingContainer>;
};

const LandingContainer = styled.div`
  width: 100%;

  .images {
    position: absolute;
    top: 0;
    left: 0;
    height: ${props => props.imageHeight ? `${props.imageHeight}px` : "auto"};
  }
`;

const FooterSection = styled.section`
  width: 100%;
`;
