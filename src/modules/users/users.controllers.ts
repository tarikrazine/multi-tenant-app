import { FastifyReply, FastifyRequest } from "fastify";

import { CreateUserBodySchema } from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "./../roles/roles.services";

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserBodySchema }>,
  reply: FastifyReply,
) {
  const { initialUser, ...data } = request.body;

  const roleName = initialUser
    ? SYSTEM_ROLES.SUPER_ADMIN
    : SYSTEM_ROLES.APPLICATION_USER;

  const role = await getRoleByName({
    name: roleName,
    applicationId: data.applicationId,
  });
}
