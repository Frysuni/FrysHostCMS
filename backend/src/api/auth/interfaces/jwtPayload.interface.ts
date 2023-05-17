export interface CreateJwtPayload {
    id: number;

    uuid: string;

    type: 'access' | 'refresh' | 'key';
}

export interface GetJwtPayload extends CreateJwtPayload {
    iat: number;

    exp: number;
}