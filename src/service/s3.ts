import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = ["S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "S3_BUCKET", "S3_FILE_URL"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
}


if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
    throw new Error("Missing S3 credentials");
}

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }
});

const S3_BUCKET = process.env.S3_BUCKET 
const S3_FILE_URL = process.env.S3_FILE_URL

export async function getObjectUrl(filename: string): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: `uploads/admin-uploads/${filename}`
    });

    try {
        return await getSignedUrl(s3Client, command);
    } catch (error) {
        throw new Error(`Error generating GET URL: ${(error as Error).message}`);
    }
}

export async function putObject(filename: string, contentType: string): Promise<string> {
    // ✅ Generate timestamp in "YYYYMMDD-HHMMSS" format
    const timestamp = new Date().toISOString().replace(/[-:.T]/g, "").slice(0, 15);

    // ✅ Attach timestamp to filename (e.g., "file-20240212-153045.pdf")
    const uniqueFilename = `${filename.replace(/\s+/g, "_")}-${timestamp}`;

    const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: `uploads/store-uploads/${uniqueFilename}`,
        ContentType: contentType,
    });

    try {
        return await getSignedUrl(s3Client, command);
    } catch (error) {
        throw new Error(`Error generating PUT URL: ${(error as Error).message}`);
    }
}

