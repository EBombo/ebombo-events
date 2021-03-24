import resizeImage from "resize-image";

export const useResizeImage = () => {
    const resize = (event, resizeWidth, resizeHeight) =>
        new Promise((resolve) => {
            const documentFile = event.target.files[0];
            const fileSuffix = documentFile.name.split(".").pop();
            const type =
                fileSuffix.toLowerCase() === "jpeg"
                    ? resizeImage.JPEG
                    : fileSuffix.toLowerCase() === "png"
                    ? resizeImage.PNG
                    : fileSuffix.toLowerCase() === "gif"
                        ? resizeImage.GIF
                        : fileSuffix.toLowerCase() === "webp"
                            ? resizeImage.WEBP
                            : resizeImage.BMP;

            const reader = new FileReader();
            reader.onload = (upload) => {
                let dataUrl = upload.target.result;
                let image = new Image();
                image.src = dataUrl;
                image.onload = () => {
                    let ImgBase64_ = resizeImage.resize(
                        image,
                        resizeWidth,
                        resizeHeight,
                        type
                    );

                    if (type === "gif") ImgBase64_ = dataUrl;

                    resolve(ImgBase64_);
                };
            };
            reader.readAsDataURL(documentFile);
        });

    return {
        resize: (event, resizeWidth, resizeHeight) =>
            resize(event, resizeWidth, resizeHeight),
    };
};
