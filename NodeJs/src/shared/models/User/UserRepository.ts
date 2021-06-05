import { EntityRepository, Repository } from "typeorm";
import User from ".";
import bcrypt from "bcryptjs";

@EntityRepository(User)
class UserRepository extends Repository<User> {
  async startSession(email: string, password: string): Promise<User | undefined> {
    const select: any = this.metadata.columns.map((e) => e.propertyName);

    const user = await this.findOne({ where: { email }, select });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      delete user.password;

      user.updateSession();

      await this.save(user);

      return user;
    }
  }
}

export default UserRepository;
