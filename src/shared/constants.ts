export enum Paths {
    Applications = 'applications',
    Users = 'users',
    Projects = 'projects',
}

export const enum Role {
    admin = 'admin',
    employee = 'employee',
    manager = 'manager',
}

export const RoleRus = {
    [Role.admin]: 'Администратор',
    [Role.employee]: 'Сотрудник',
    [Role.manager]: 'Менеджер',
};

export const Status = {
    0: 'success',
    1: 'warning',
    2: 'error',
};

export const versionApp = '0.0.1';
export const apiBaseUrl = 'api';
export const apiPrefix = '';
export const locale = 'ru-RU';
export const nameApp = '';
