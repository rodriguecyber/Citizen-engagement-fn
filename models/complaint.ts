import mongoose, { type Document, Schema } from "mongoose"

interface IAttachment {
  name: string
  url: string
  type: string
  size: number
}

interface IComment {
  message: string
  user: mongoose.Types.ObjectId
  role: string
  createdAt: Date
}

interface ITimeline {
  action: string
  user: mongoose.Types.ObjectId
  role: string
  timestamp: Date
}

export interface IComplaint extends Document {
  title: string
  description: string
  organization: mongoose.Types.ObjectId
  category: string
  status: "received" | "in_progress" | "needs_info" | "resolved" | "rejected" | "escalated"
  priority: "low" | "medium" | "high"
  citizen: mongoose.Types.ObjectId
  sector: mongoose.Types.ObjectId
  district: mongoose.Types.ObjectId
  assignedTo: mongoose.Types.ObjectId
  attachments: IAttachment[]
  comments: IComment[]
  timeline: ITimeline[]
  dueDate: Date
  resolvedDate?: Date
  escalatedTo?: "sector" | "district" | "organization"
  escalatedDate?: Date
  createdAt: Date
  updatedAt: Date
}

const complaintSchema = new Schema<IComplaint>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["received", "in_progress", "needs_info", "resolved", "rejected", "escalated"],
      default: "received",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    citizen: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sector: {
      type: Schema.Types.ObjectId,
      ref: "Sector",
      required: true,
    },
    district: {
      type: Schema.Types.ObjectId,
      ref: "District",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
      },
    ],
    comments: [
      {
        message: String,
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        role: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    timeline: [
      {
        action: String,
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        role: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    dueDate: {
      type: Date,
      required: true,
    },
    resolvedDate: {
      type: Date,
    },
    escalatedTo: {
      type: String,
      enum: ["sector", "district", "organization"],
    },
    escalatedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Create a compound index for organization and citizen
complaintSchema.index({ organization: 1, citizen: 1 })

// Create indexes for status filtering
complaintSchema.index({ status: 1, organization: 1 })
complaintSchema.index({ status: 1, sector: 1 })
complaintSchema.index({ status: 1, district: 1 })

const Complaint = mongoose.model<IComplaint>("Complaint", complaintSchema)

export default Complaint
