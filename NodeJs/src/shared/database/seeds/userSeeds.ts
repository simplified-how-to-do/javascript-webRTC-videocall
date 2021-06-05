import User from "@models/User";

interface IUserSeed {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  birthday?: string;
  avatarId?: string;
  nationalId?: string;
}

/**
 * Equal to "123123"
 */
const password = "$2y$08$pwr.UoP9Wy5q2PAKbdyzMuRTp9FurXnDaYb97ycrhjR2jnS/ehuEq";

const createdAt = new Date();
const updatedAt = new Date();

const userSeeds: IUserSeed[] = [
  {
    name: "Rafael Rudá Rocha Cordeiro Guedes",
    email: "rrocha.rafael@gmail.com",
    createdAt,
    updatedAt,
    password,
    birthday: "1992-03-24",
  },
];

export default userSeeds;
