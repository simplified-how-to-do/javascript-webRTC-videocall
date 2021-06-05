import { existsSync, unlinkSync } from "fs";
import { resolve } from "path";
import crypto from "crypto";
import multer from "multer";

function excludeCheck(data: any, exclude: any) {
  if (Array.isArray(exclude)) {
    return !exclude?.find((e) => {
      const dFilename = data?.filename || data;
      const dFieldname = data?.fieldname || data;
      const eFilename = e?.filename || e;
      const eFieldname = e?.fieldname || e;

      return dFieldname === eFieldname || dFilename === eFilename;
    });
  } else {
    const dFilename = data?.filename || data;
    const dFieldname = data?.fieldname || data;
    const eFilename = exclude?.filename || exclude;
    const eFieldname = exclude?.fieldname || exclude;

    return dFieldname !== eFieldname && dFilename !== eFilename;
  }
}

export const storagePath = resolve(__dirname, "..", "..", "tmp", "uploads");

export function storageFilePath(filename: string) {
  return resolve(storagePath, filename);
}

export function storageFileExists(filename: string) {
  try {
    return existsSync(storageFilePath(filename));
  } catch {
    return false;
  }
}

interface IthisBulkDelete {
  /** It can be string, or object with "filename" key, both can be inside a array or not. */
  exclude?: any;
  /** If false, it will not check if file exists before delete. */
  deleteIfExist?: true;
}

/**
 * @param filenames It can be string, or object with "filename" key, both can be inside a array or not.
 * @param options
 */
export function storageDeleteFiles(filenames: any, options: IthisBulkDelete) {
  const { deleteIfExist = true, exclude } = options;
  let filesArray: string[] = [];

  function checkVal(data: any) {
    const thisVal = data?.filename || data;
    if (typeof thisVal === "string" && excludeCheck(data, exclude)) {
      filesArray.push(thisVal);
    }
  }

  if (Array.isArray(filenames)) {
    filenames.forEach((e) => checkVal(e));
  } else {
    checkVal(filenames);
  }

  function deleteThisFile(thisFile: string) {
    unlinkSync(storageFilePath(thisFile));
  }

  return filesArray.forEach((f) => {
    if (deleteIfExist) {
      if (storageFileExists(f)) {
        deleteThisFile(f);
      }
    } else {
      deleteThisFile(f);
    }
  });
}

export default {
  storagePath,
  storageFilePath,
  storageFileExists,
  storageDeleteFiles,
  multerOptions: {
    storage: multer.diskStorage({
      destination: storagePath,
      filename: (req, file, callback) => {
        const fileHash = crypto.randomBytes(10).toString("hex");
        const filename = `${new Date().getTime()}-${fileHash}-${file.originalname}`;

        return callback(null, filename);
      },
    }),
  },
};
