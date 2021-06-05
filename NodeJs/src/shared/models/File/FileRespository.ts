import { EntityRepository, Repository, FindManyOptions } from "typeorm";
import path from "path";
import File from ".";
import AppError from "@errors/AppError";
import uploadConfig from "@config/uploadConfig";

interface IFile {
  originalname: string;
  filename: string;
  /** If not used, filename will be used to obtain the file extension. */
  ext?: string;
}

type IFindOptions = Omit<FindManyOptions, "where">;

@EntityRepository(File)
class FileRespository extends Repository<File> {
  /**
   * @param filenames It can be string, or object with "filename" key, both can be inside a array or not.
   * @param options
   */
  async findByFilenames(filenames: any, options?: IFindOptions): Promise<File[]> {
    let filesArray: string[] = [];

    function checkVal(data: any) {
      const thisVal = data?.filename || data;
      if (typeof thisVal === "string") {
        filesArray.push(thisVal);
      }
    }

    if (Array.isArray(filenames)) {
      filenames.forEach((e) => checkVal(e));
    } else {
      checkVal(filenames);
    }

    return this.find({ ...(options as any), where: { filename: filesArray } });
  }

  /**
   * @param filenames It can be string, or object with "filename" key, both can be inside a array or not.
   * @param options
   */
  async unlinkUnfoundFilenames(filenames: any, options?: IFindOptions): Promise<void> {
    let filesArray: any[] = [];

    function checkVal(data: any) {
      const thisVal = data?.filename || data;
      if (typeof thisVal === "string") {
        filesArray.push({ filename: thisVal });
      }
    }

    if (Array.isArray(filenames)) {
      filenames.forEach((e) => checkVal(e));
    } else {
      checkVal(filenames);
    }

    if (filesArray.length > 0) {
      const excludeFiles = await this.find({ ...(options as any), where: filesArray });

      const unlinkFiles: string[] = [];

      filesArray.forEach((e) => !excludeFiles.find((f) => f.filename === e?.filename) && unlinkFiles.push(e));

      if (unlinkFiles.length > 0) {
        uploadConfig.storageDeleteFiles(unlinkFiles, { deleteIfExist: true });
      }
    }
  }

  createWithLocalFiles(files: IFile | IFile[]): File[] {
    let filesArray: IFile[] = [];

    function checkVal(data: IFile) {
      const { filename, originalname, ext: extProp } = data || {};
      const ext = typeof extProp === "string" ? extProp : typeof filename === "string" && path.extname(filename);

      if (typeof originalname === "string" && ext) {
        filesArray.push({ filename, originalname, ext });
      } else {
        throw new AppError("File with invalid filename or originalname", { statusCod: 500 });
      }
    }

    if (Array.isArray(files)) {
      files.forEach((e) => checkVal(e));
    } else {
      checkVal(files);
    }

    if (!(filesArray.length > 0)) {
      throw new AppError("There are no valid files to be created.", { statusCod: 500 });
    }

    return this.create(filesArray);
  }
}

export default FileRespository;
