import { IOrganization } from "./organization"
import { IUser } from "./user"

export enum ComplaintStatus {
    RECEIVED = 'received',
    IN_PROGRESS = 'in_progress',
    NEEDS_INFO = 'needs_info',
    RESOLVED = 'resolved',
    REJECTED = 'rejected',
    ESCALATED = 'escalated'
  }
  
  // Enum for escalation level
  export enum EscalationLevel {
    SECTOR = 'sector',
    DISTRICT = 'district',
    ORGANIZATION = 'organization'
  }
  
  // Interface for escalation details
  interface EscalationDetails {
    level: EscalationLevel
    reason: string
    requestedBy: string // 'citizen' | 'sector_admin' | 'district_admin'
    timestamp: Date
    originalLocation?: {
      district: string
      sector: string
    }
    handledBy?: string // ID of admin who handled the escalation
    resolution?: string
  }
  
  // Interface for comment
  interface IComment {
    _id:string
    text: string
    user: IUser
    role:  'citizen' | 'sector_admin' | 'district_admin' | 'org_admin'
    createdAt: string
    attachments?: string[] // URLs to attached files
  }
  
  export interface IComplaint extends Document {
    _id:string
    title: string,
    complaintId:string
    description: string
    service: string // Service from organization
    organization: IOrganization
    district?: {name:string,_id:string} // Optional because of org-level escalation
    sector?: {name:string,_id:string}  // Optional because of district/org-level escalation
    citizen: IUser  // Reference to the citizen who submitted
    status: ComplaintStatus
    createdAt: string
    updatedAt: string
  
    // Escalation related fields
    escalateToDistrict: boolean
    escalateToOrg: boolean
    escalationLevel: EscalationLevel
    escalationDetails?: EscalationDetails
  
    // Tracking fields
    assignedTo?: string // Admin assigned to handle the complaint
    assignedAt?: string
    resolvedAt?: string
    resolution?: string
  
    // Additional metadata
    attachments?: string[] // URLs to attached files
    comments: IComment[]
  }
  