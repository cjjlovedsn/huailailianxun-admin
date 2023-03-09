export interface ILoginRequestData {
  loginName: string
  password: string
}

export type LoginCodeResponseData = IApiResponseData<string>

export type LoginResponseData = IApiResponseData<{
  email: string
  loginDate: string
  loginDateText: string
  loginIp: string
  loginName: string
  phonenumber: string
  sex: string
  token: string
  userId: number
  userName: string
}>

export type UserInfoResponseData = IApiResponseData<{ username: string; roles: string[] }>
