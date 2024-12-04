import {FastifyReply, FastifyRequest} from "fastify";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../../../../../constants.js";
import jwt from "jsonwebtoken";
import {LoginDTO} from "../../admin/dtos/users.dto.js";
import {User} from "../../../../../db/entities/vendor/users.entity.js";

export async function loginUser(
    request: FastifyRequest<{ Body: LoginDTO }>,
    reply: FastifyReply
) {
    const userRepository = request.vendorDataSource!.getRepository(User);
    const {email, password} = request.body;

    const user = await userRepository?.findOne({
        where: {email}, relations: {
            customer: true,
            staff: {
                officePersonnelInfo: true,
                driverInfo: true,
                vehicleAssistantInfo: true
            },
        }
    });


    if (user && (await user.validatePassword(password))) {
        const {
            hashSecureCred,
            hashUpdatePassword,
            loadSecurityCred,
            validatePassword,
            validatePin,
            pin,
            password,
            ...rest
        } = user;
        const accessToken = jwt.sign({...rest, path: "admin"}, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN * 10000,
        });

        return reply
            .code(200)
            .send({success: true, message: "Login successful", accessToken});
    }
    return reply
        .code(401)
        .send({success: false, message: "Invalid credentials"});
}

export async function validatePin(
    request: FastifyRequest<{ Body: { pin: string } }>,
    reply: FastifyReply
) {
    const {pin} = request.body;
    const userRepository = request.vendorDataSource!.getRepository(User);
    if (!userRepository)
        return reply
            .status(401)
            .send({success: false, message: "Unauthorised action"});
    const currentUser = request.user;
    if (!currentUser)
        return reply
            .status(401)
            .send({success: false, message: "Unauthorised action"});
    const user = await userRepository.findOneBy({id: currentUser.id});
    if (!user)
        return reply
            .status(401)
            .send({success: false, message: "User not found"});
    if (!user.pin)
        return reply
            .status(400)
            .send({success: false, message: "User has no pin"});
    if (user.pin && !(await user.validatePin(pin)))
        return reply.code(401).send({success: false, message: "Invalid pin"});
    return reply.code(200).send({success: true, message: "Pin validated", pin});
}
