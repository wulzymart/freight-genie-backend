import PublicUserRoles from "../../../../../custom-types/public-user-roles.js";

export class UserDTO {
  name: string;
  email: string;
  password: string;
  role: PublicUserRoles;
}

export class EditUserDTO {
  name: string;
}

export class ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}
export class InitPasswordResetDTO {
  email: string;
}
export class ResetPasswordDTO {
  id: string;
  newPassword: string;
}

export class LoginDTO {
  email: string;
  password: string;
}
