export type User = {
  uuid: string,
  email: string,
  username: string,
  memberId: string,
  assets: [{
    id: number,
    user: string,
    type: 'skin' | 'cloak',
    hd: boolean,
    slim: boolean | null
  }],
  registered: string
};