import React, { useState, useEffect } from "reactn";
import styled from "styled-components";
import { ButtonAnt } from "../../../components/form";
import { spinLoader } from "../../../components/common/loader";
import { firestore } from "../../../firebase";
import { useRouter } from "next/router";
import { PlayCircleOutlined, PauseOutlined } from "@ant-design/icons";
import { snapshotToArray } from "../../../utils";

export const Music = (props) => {
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audio, setAudio] = useState(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = () =>
    firestore
      .collection("music")
      .where("deleted", "==", false)
      .onSnapshot((musicSnapshot) => {
        // if (!musicSnapshot.exists) return router.back();

        setMusic(snapshotToArray(musicSnapshot));
        setLoading(false);
      });

  const playSong = (song) => {
    if (currentTitle === song.title) {
      audio.play();
    } else {
      if (audio) audio.pause();
      let _audio = new Audio();
      _audio.src = song.songUrl;
      _audio.play();
      setCurrentTitle(song.title);
      setAudio(_audio);
    }
    setIsPlaying(true);
  };

  const stopSong = () => {
    audio.pause();
    setIsPlaying(false);
  };

  if (loading) return spinLoader();

  return (
    <MusicContainer>
      <ButtonAnt
        variant="contained"
        color="primary"
        onClick={() => router.push("/admin/music/new")}
      >
        Añadir Musica
      </ButtonAnt>
      <div className="songs-container">
        {music.map((song, index) => (
          <div className="song" key={""}>
            <div className="order">{index + 1}.-</div>
            <div className="title">
              <div className="buttons-container">
                {currentTitle === song.title && isPlaying ? (
                  <PauseOutlined onClick={() => stopSong()} />
                ) : (
                  <PlayCircleOutlined onClick={() => playSong(song)} />
                )}
              </div>
              {song.title}
            </div>
          </div>
        ))}
      </div>
    </MusicContainer>
  );
};

const MusicContainer = styled.div`
  width: 100%;
  padding: 1rem;

  .songs-container {
    padding: 1rem;

    .song {
      display: grid;
      grid-template-columns: 40px auto auto;
      align-items: center;
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      margin: 1rem 0;

      .order {
        color: ${(props) => props.theme.basic.secondary};
      }

      .title {
        display: grid;
        grid-template-columns: 45px auto;
        align-items: center;
      }

      .buttons-container {
        .anticon {
          font-size: 30px;
        }
        .anticon-play-circle {
          color: ${(props) => props.theme.basic.primary};
          margin-right: 10px;
        }

        .anticon-pause {
          color: ${(props) => props.theme.basic.warning};
        }
      }
    }
  }
`;
