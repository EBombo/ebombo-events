import React, {useEffect, useState} from "react";
import {Button, Modal, Upload} from "antd";
import {firestore, storage} from "../../../firebase";
import get from "lodash/get";
import {Icon} from "../../../components/common/Icons";

export default (props) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const propsToFileList = (console) => {
    if (get(props, "console.iconUrl")) {
      return [
        {
          uid: get(console, "iconUrl"),
          url: get(console, "iconUrl"),
        },
      ];
    }
    return [];
  };

  useEffect(() => {
    setFileList(propsToFileList(props.console));
  }, []);

  useEffect(() => {
    setFileList(propsToFileList(props.console));
  }, [props.console]);

  const cancelViewImage = () => {
    setPreviewImage("");
    setPreviewVisible(false);
  };

  const viewImage = (file, previewVisible) => {
    setPreviewImage(get(file, "url", ""));
    setPreviewVisible(previewVisible);
  };

  const editImage = ({ fileList }) => setFileList(fileList);

  const uploadImage = (document) => {
    const ref = storage.ref();
    const file = document;
    const name = "icon";
    const path = `${"consoles/" + props.console.id}`;
    const metadata = {
      contentType: file.type,
      cacheControl: "public,max-age=3600",
    };
    const task = ref.child(`${path + "/" + name}`).put(file, metadata);

    task
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => {
        firestore.doc("consoles/" + props.console.id).update({
          iconUrl: url,
        });
      })
      .catch((error) => console.log(error));
  };

  const downloadImage = () => window.open(previewImage, "Download");

  const deleteImage = (document) =>
    new Promise((resolve) =>
      Modal.confirm({
        className: "delete-photo",
        title: "Are you sure to make this action?",
        okText: "CONFIRM",
        cancelText: "CANCEL",
        onOk: async () => {
          await deleteIconConsole(document);
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
      })
    );

  const deleteIconConsole = async () =>
    await firestore
      .doc("consoles/" + props.console.id)
      .update({ iconUrl: null });

  return (
    <div className="div-image">
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={(file) => viewImage(file, true)}
        onChange={editImage}
        action={uploadImage}
        onRemove={deleteImage}
        accept="image/*"
      >
        {fileList.length >= 1 ? null : (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">ICONO</div>
          </div>
        )}
      </Upload>
      <Modal
        className="visitor-document"
        visible={previewVisible}
        centered
        footer={
          <div className="preview-image">
            <Button
              onClick={downloadImage}
              type="primary"
              icon="download"
              size="large"
            >
              DOWNLOAD
            </Button>
          </div>
        }
        onCancel={cancelViewImage}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};
