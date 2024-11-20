import { adminDataSource } from "../../../../../db/admin.orm.config.js";
import { User } from "../../../../../db/entities/admin/user.entity.js";
export const userRepository = adminDataSource.getRepository(User);
export async function getUsers() {
  return await userRepository.find();
}

export async function getUser(id: string) {
  const user = await userRepository.findOne({ where: { id } });
  user && delete (user as any).password;
  return user;
}
export async function addUser(userData: User) {
  const user = userRepository.create(userData);
  await user.save();
  delete (user as any).password;
  return user;
}
export async function updateUser(userData: User) {
  await userRepository.update({ id: userData.id }, userData);
  return userData;
}

export async function deleteUser(id: string) {
  await userRepository.delete({ id });
}
