import {storage as storageDefault} from "../firebase";
import get from "lodash/get";

const buckets = {
    defaultStorage: storageDefault
};

export const useUploadToStorage = () => {
    const uploadToStorageAndGetURL = (
        image,
        path,
        fileName,
        fileSuffix,
        bucket
    ) =>
        new Promise((resolve) => {
            const storage = get(buckets, `${bucket}`, "defaultStorage");
            const uploadTask = storage
                .ref(`${path}/${fileName}.${fileSuffix}`)
                .putString(image, "base64", {contentType: `image/${fileSuffix}`});

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    const _fileUrl = await storage
                        .ref(`/${path}`)
                        .child(`${fileName}.${fileSuffix}`)
                        .getDownloadURL();

                    resolve(_fileUrl);
                }
            );
        });

    return {
        uploadToStorageAndGetURL: (
            image,
            path,
            fileName,
            fileSuffix,
            bucket = "landings"
        ) => uploadToStorageAndGetURL(image, path, fileName, fileSuffix, bucket),
    };
};
