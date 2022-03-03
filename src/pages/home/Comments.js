import React, { useEffect, useMemo, useState } from "reactn";
import styled from "styled-components";
import { config } from "../../firebase";
import { Image } from "../../components/common/Image";
import { Desktop, mediaQuery, Tablet } from "../../constants";
import { spinLoaderMin } from "../../components/common/loader";

const comments = [
  {
    name: "Mercedes Polo",
    img: `${config.storageUrl}/resources/comments/user1.jpeg`,
    logo: `${config.storageUrl}/resources/comments/ripley.jpeg`,
    job: "Sub Gerente de Comunicación Interna en Ripley Perú",
    comment:
      "Agradecerles por el apoyo en la ejecución de nuestro primer Ripley Fest! Estamos haciendo un trabajo increíble, generando una interacción única en nuestra plataforma y dándole entretenimiento a nuestros colaboradores.",
  },
  {
    name: "Vincezo Calvi",
    img: `${config.storageUrl}/resources/comments/user2.jpg`,
    logo: `${config.storageUrl}/resources/comments/adidas.png`,
    job: "Sr. Specialist Brand Comms Football & HBS de Adidas Perú",
    comment:
      'Presentamos el video del Mastercup al director de marketing de Adidas. Amó la iniciativa, las artes, la dinámica y todo. Se lo mostrará a primera línea en Perú y a nivel región como un "Best Practice" a nivel LatAm. Asi que felicitaciones por la chamba y gracias por todo el empuje',
  },
  {
    name: "Pamela Román",
    img: `${config.storageUrl}/resources/comments/user3.jpg`,
    logo: `${config.storageUrl}/resources/comments/san-fer.jpeg`,
    job: "Coordinadora de Capacitación y desarrollo de San Fernando",
    comment:
      "Gracias chicos, un éxito. Como vieron hemos mencionado que vamos a seguir haciendo estos eventos así que contamos con ustedes. El gerente terminó satisfecho.",
  },
  {
    name: "Renata Arce",
    img: `${config.storageUrl}/resources/comments/user4.jpg`,
    logo: `${config.storageUrl}/resources/comments/mall-avent.png`,
    job: "Coordinadora de Clima y Cultura de Mall Aventura",
    comment:
      "Les comento que mandamos una encuesta sobre el evento de hoy y vamos 4.86 de 5. Los comentarios que nos han hecho la gente disfrutó mucho el evento de hoy y también de los viernes pasados. ¡Gracias por el apoyo de todo el equipo, por el aguante con tanto cambio!",
  },
  {
    name: "Valentina Gonzales",
    img: `${config.storageUrl}/resources/comments/user5.jpeg`,
    logo: `${config.storageUrl}/resources/comments/adidas.png`,
    job: "Communications Manager & Social Impact Lead de Adidas México",
    comment:
      "Muchas gracias por el evento del día de ayer, la verdad es que nos ayudaron bastante en toda la producción. Felicitaciones al equipo de ebombo que hicieron un buen trabajo y supieron que hacer en todo momento.",
  },
  {
    name: "Diego Portugal",
    img: `${config.storageUrl}/resources/comments/user6.jpeg`,
    logo: `${config.storageUrl}/resources/comments/kpmg.png`,
    job: "Analista Clima y Cultura KPMG",
    comment: "¡Gracias a todos! Me gustó mucho el evento, estoy recibiendo muy buenos comentarios también.",
  },
];

export const Comments = (props) => {
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState(comments[0]);

  useEffect(() => {
    // This is necessary in order not to break the design.
    setLoading(false);
  }, []);

  const currentComment = useMemo(() => {
    if (!comment) return <div />;

    return (
      <div className="content-selected">
        <Image src={comment.img} size="contain" width="150px" height="150px" margin="15px auto" borderRadius="50%" />

        <div className="comment">"{comment.comment}"</div>

        <Image src={comment.logo} size="contain" width="100px" height="100px" margin="auto" />

        <div className="name">{comment.name}</div>

        <div className="job">{comment.job}</div>
      </div>
    );
  }, [comment]);

  if (loading) return spinLoaderMin();

  return (
    <CommentsStyled tapiz={`${config.storageUrl}/resources/tapiz.svg`}>
      <div className="content">
        <div>
          {comments.slice(0, 3).map((user) => (
            <Image
              onClick={() => setComment(user)}
              key={user.img}
              src={user.img}
              size="contain"
              width="100px"
              height="100px"
              margin="24px"
              borderRadius="50%"
              cursor="pointer"
              className={comment.img === user.img ? "selected" : "opacity"}
            />
          ))}
        </div>

        <Desktop>{currentComment}</Desktop>

        <div>
          {comments.slice(3, 6).map((user) => (
            <Image
              onClick={() => setComment(user)}
              key={user.img}
              src={user.img}
              size="contain"
              width="100px"
              height="100px"
              margin="24px"
              borderRadius="50%"
              cursor="pointer"
              className={comment.img === user.img ? "selected" : "opacity"}
            />
          ))}
        </div>
      </div>

      <Tablet>{currentComment}</Tablet>
    </CommentsStyled>
  );
};

const CommentsStyled = styled.div`
  padding: 4rem 2rem;
  background-color: ${(props) => props.theme.basic.success};
  background-image: ${(props) => `url('${props.tapiz}')`};

  .content {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr;

    ${mediaQuery.afterTablet} {
      grid-template-columns: 1fr 3fr 1fr;
    }

    .opacity {
      opacity: 0.5;
    }

    .selected {
      opacity: 1;
    }
  }

  .content-selected {
    margin: auto;
    text-align: center;

    .comment {
      font-size: 15px;
      padding: 0 2rem;
      font-weight: bold;

      ${mediaQuery.afterTablet} {
        font-size: 25px;
      }
    }

    .name {
      font-size: 20px;
      font-weight: bold;
    }

    .job {
      font-size: 18px;
    }
  }
`;
