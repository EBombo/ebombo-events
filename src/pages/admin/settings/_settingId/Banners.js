import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { firestore } from "../../../../firebase";
import { spinLoader } from "../../../../utils";
import {
  ButtonBombo,
  ImageUpload,
  Input,
  Upload,
} from "../../../../components";
import { bannersList } from "../../../../components/common/DataList";
import get from "lodash/get";
import { message } from "antd";

export const Banners = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [banners, setBanners] = useState();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () =>
    firestore.doc("settings/banners").onSnapshot((snapShot) => {
      setBanners(snapShot.data());
      setIsLoading(false);
    });

  const updateBanners = async (documentBanner, banner) => {
    console.log(documentBanner);
    banner[`${banner.id}Url`] = documentBanner[0];
    setBanners({ ...banners, [banner.id]: banner });
  };

  const deleteBanner = async (id) => {
    setBanners({ ...banners, [id]: {} });
  };

  const saveLinks = async () => {
    setIsSaving(true);
    try {
      await firestore.doc(`settings/banners`).set(banners);
      message.success("Se guardo corectamente");
    } catch (error) {
      message.success("Ocurrio un error, intente nuevamente");
    }
    setIsSaving(false);
  };

  if (isLoading) return spinLoader();

  return (
    <div>
      <FieldsetContainer>
        <legend>Banners</legend>
        {bannersList.map((banner, index) => (
          <div className={"banner"} key={`banner-${index}`}>
            <div>
              {banner.name} - [{banner.resolution}]
            </div>
            <div className="main-container">
              <div className="image-container">
                <ImageUpload
                  file={get(banners, `${banner.id}.${banner.id}Url`, null)}
                  fileName={banner.id}
                  filePath={`banners/${banner.id}`}
                  bucket="settings"
                  sizes={banner.resolution}
                  afterUpload={(documentBanner) =>
                    updateBanners(documentBanner, banner)
                  }
                />
              </div>
              <div className="input-container">
                <Input
                  variant="secondary"
                  type="url"
                  onBlur={(e) => {
                    let newBanners = banners;
                    newBanners[banner.id].link = e.target.value;
                    setBanners(newBanners);
                  }}
                  defaultValue={get(banners[banner.id], "link", "https://")}
                  placeholder="Link Banner"
                  name="link"
                />
              </div>
            </div>
          </div>
        ))}
        <ButtonBombo
          type="primary"
          onClick={() => saveLinks()}
          loading={isSaving}
          disabled={isSaving}
        >
          Guardar Banners
        </ButtonBombo>
      </FieldsetContainer>
    </div>
  );
};

const FieldsetContainer = styled.fieldset`
  border: 1px solid #292929;
  width: auto;
  border-radius: 7px;
  padding: 15px 20px;
  height: 100%;
  margin-top: 1rem;

  legend {
    width: auto;
    margin: 0;
    color: #000000;

    span {
      font-family: "Encode Sans", sans-serif;
      font-size: 0.8rem;
      padding: 0 10px 0 10px;
      font-weight: 600;
    }
  }

  .banner {
    margin: 1rem 0;
    .main-container {
      display: flex;
      flex-direction: column;
      max-width: 500px;
      .input-container {
        margin-top: 10px;
      }
    }
  }
`;
