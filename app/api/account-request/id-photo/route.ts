import { NextResponse } from "next/server"
import { getCloudinary } from "@/lib/cloudinary"

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "Файл слишком большой (макс. 5MB)" }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Неподдерживаемый формат (JPG, PNG, WEBP)" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const folder = "mz/ud"

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const cloudinary = getCloudinary()
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder,
          overwrite: false,
        },
        (error: unknown, result: any) => {
          if (error) {
            const e: any = error
            const message =
              e?.message ||
              e?.error?.message ||
              (typeof e === "string" ? e : "Ошибка Cloudinary")
            const httpCode = e?.http_code || e?.error?.http_code
            const errMessage = httpCode ? `${message} (Cloudinary ${httpCode})` : message
            return reject(new Error(errMessage))
          }
          resolve(result)
        }
      )

      stream.end(buffer)
    })

    return NextResponse.json({ url: uploadResult.secure_url, publicId: uploadResult.public_id })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Ошибка при загрузке фото" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const publicId = typeof body?.publicId === "string" ? body.publicId : ""

    if (!publicId || publicId.length < 3) {
      return NextResponse.json({ error: "publicId обязателен" }, { status: 400 })
    }

    // Safety: allow deleting only within mz/ud folder
    if (!publicId.startsWith("mz/ud/")) {
      return NextResponse.json({ error: "Нельзя удалить файл вне папки mz/ud" }, { status: 400 })
    }

    const cloudinary = getCloudinary()
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" })

    return NextResponse.json({ ok: true, result })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Ошибка при удалении фото" },
      { status: 500 }
    )
  }
}
