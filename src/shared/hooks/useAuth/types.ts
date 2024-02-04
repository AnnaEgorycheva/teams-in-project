import { Role } from '../../constants';

export interface IGetUser {
    email: string;
    name: string;
    role: Role;
    id: string;
}
export interface ICredentials {
    email: string;
    password: string;
}
