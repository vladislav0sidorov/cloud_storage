import { model, Schema } from 'mongoose'

const fileSchema = new Schema(
  {
    name: { type: String, required: true },
    path: { type: String },
    size: { type: Number, default: 0 },
    isFolder: { type: Boolean, required: true, default: false },
    parentId: { type: Schema.Types.ObjectId, ref: 'File', default: null },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mimeType: { type: String }
  },
  { timestamps: true }
)

fileSchema.index({ userId: 1, parentId: 1 })

export const FileModel = model('File', fileSchema)
