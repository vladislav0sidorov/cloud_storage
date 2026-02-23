import { model, Schema } from 'mongoose'

const fileSchema = new Schema(
  {
    name: { type: String, required: true },
    /** путь на диске (только для файлов) */
    path: { type: String },
    /** размер в байтах (только для файлов) */
    size: { type: Number, default: 0 },
    /** true = папка, false = файл */
    isFolder: { type: Boolean, required: true, default: false },
    /** родительская папка (null = корень) */
    parentId: { type: Schema.Types.ObjectId, ref: 'File', default: null },
    /** владелец */
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mimeType: { type: String }
  },
  { timestamps: true }
)

fileSchema.index({ userId: 1, parentId: 1 })

export const FileModel = model('File', fileSchema)
