type ITypeString = "boolean" | "char" | "varchar" | "text" | "integer" | "double" | "json" | "array" | "date" | "dateonly" | "time";

interface ITypeObject {
  type: ITypeString;
  sensitivity?: number;
  arrayType?: ITypeObject;
  enum?: any[];
}

interface IProperties {
  [key: string]: {
    type: ITypeObject;
    allowNull: boolean;
    validation: Function;
    unique: boolean;

    // Object Properties
    defaultValue?: any;
    readonly?: boolean;
    configurable?: boolean;
    get?: Function;
    set?: Function;
    writable?: boolean;
  };
}

interface IEntityBuilderArg {
  entity: {
    properties: IProperties;
    methods: {
      [key: string]: Function;
    };
  };
}

function entityBuilder(arg: IEntityBuilderArg) {
  return arg;
}
