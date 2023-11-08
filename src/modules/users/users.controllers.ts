import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { CreateUserBodySchema, LoginBody } from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "./../roles/roles.services";
import {
  assignRoleToUser,
  createUser,
  getUserByEmail,
  getUsersByApplication,
} from "./users.services";

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserBodySchema }>,
  reply: FastifyReply,
) {
  const { initialUser, ...data } = request.body;

  const roleName = initialUser
    ? SYSTEM_ROLES.SUPER_ADMIN
    : SYSTEM_ROLES.APPLICATION_USER;

  if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    const appUsers = await getUsersByApplication(data.applicationId);

    if (appUsers.length > 0) {
      return reply.code(400).send({
        message: "Application already has super user",
        extensions: {
          code: "APPLICATION_ALREADY_SUPER_USER",
          applicationId: data.applicationId,
        },
      });
    }
  }

  const role = await getRoleByName({
    name: roleName,
    applicationId: data.applicationId,
  });

  if (!role) {
    return reply.code(404).send({
      message: "Role not found",
    });
  }

  try {
    const user = await createUser(data);

    // Assign a role  to the user
    await assignRoleToUser({
      applicationId: data.applicationId,
      userId: user.id,
      roleId: role.id,
    });

    return user;
  } catch (error) {
    console.log("[CREATE_USER]", error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
) {
  const { email, password, applicationId } = request.body;

  const userExist = await getUserByEmail(email, applicationId);

  if (!userExist) {
    return reply.code(400).send({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign({
    id: userExist.id,
    email,
    applicationId,
    scopes: userExist.permissions,
  }, "secret");

  return {
    token,
  };
}
