import multer, { Options } from "multer";
import { extname } from "path";
import uploadConfig from "@config/uploadConfig";

const defaultOptions = uploadConfig.multerOptions;

type IRemoveKeys = Omit<Options, "dest" | "storage">;

interface IOptions extends IRemoveKeys {
  allowExtensions?: string | string[];
  blockExtensions?: string | string[];
  imageOnly?: boolean;
}

function uploaderMiddleware(options?: IOptions) {
  const { allowExtensions, blockExtensions, imageOnly } = options || {};

  const customFilter = !!allowExtensions || !!blockExtensions || !!imageOnly;

  return multer({
    ...options,
    ...defaultOptions,
    ...(customFilter
      ? {
          fileFilter: (req, file, callback) => {
            const ext = extname(file.originalname);
            const imagesExt = [".jpg", ".jpeg", ".png", ".webp"];

            if (!ext) {
              return callback(new Error("The file extension could not be identified."));
            }

            function haveExt(data?: string | string[], defaultValue = true) {
              if (data) {
                const thisData = Array.isArray(data) ? data : [data];

                const thisIndex = thisData.findIndex((e) => e.toLowerCase() === ext.toLowerCase());

                return thisIndex >= 0;
              }
              return defaultValue;
            }

            const allowed = haveExt(allowExtensions) && !haveExt(blockExtensions, false);
            const images = imageOnly ? haveExt(imagesExt) : true;

            if (!allowed) {
              return callback(new Error("File extension not allowed."));
            } else if (!(allowExtensions && allowed)) {
              if (!images) {
                return callback(new Error(`File extension must be equal to ${imagesExt}.`));
              }
            }

            return callback(null, true);
          },
        }
      : {}),
  });
}

export default uploaderMiddleware;
