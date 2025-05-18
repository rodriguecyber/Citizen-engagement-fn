import { IUser } from "./user"

export interface IOrganization  {
    name: string
    services: string[]
    location: string
    email: string
    tel: string
    admin: IUser
    districts: {name:string,_id:string}[]
    createdAt: Date
    updatedAt: Date
  }