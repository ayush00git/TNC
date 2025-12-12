import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// set up a s3 client
const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const uploadToS3 = async(file: Express.Multer.File): Promise<string> => {
    const fileName = `chatRoom/img/${uuidv4()}`

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    }

    try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        console.log(`While Uploading the image: ${error}`);
        throw new Error(`While Using the service s3Bucket`);
    }
}