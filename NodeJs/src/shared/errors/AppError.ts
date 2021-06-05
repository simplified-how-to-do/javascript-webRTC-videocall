interface IAppError {
  statusCod?: number;
  userFriendly?: boolean;
}

class AppError {
  public readonly statusCod: number;

  public readonly message: string;

  public readonly userFriendly?: boolean;

  constructor(message: string, options?: IAppError) {
    const { statusCod = 400, userFriendly = false } = options || {};

    this.message = message;
    this.statusCod = statusCod;
    this.userFriendly = userFriendly === true ? true : false;
  }
}

export default AppError;
