import { IOrganization } from "./organization"

export interface IUser  {
    _id:string
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
    role: "superadmin" | "orgadmin" | "districtadmin" | "sectoradmin" | "citizen"
    organization?: IOrganization
    district?: {name:string,_id:string}
    sector?: {name:string,_id:string}
    location?: {
      province?: string
      district?: string
      sector?: string
      cell?: string
      village?: string
    }
    createdAt: Date
    updatedAt: Date
    comparePassword(candidatePassword: string): Promise<boolean>
  }