import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './model/file.model';
import * as crypto from 'crypto';

@Injectable()
export class MinioClientService {
  constructor(private readonly minio: MinioService) {}

  public get client() {
    return this.minio.client;
  }

  public async upload(file: BufferedFile, bucketName: string) {
    if (
      !(
        file.mimetype.includes('jpeg') ||
        file.mimetype.includes('png') ||
        file.mimetype.includes('pdf') ||
        file.mimetype.includes('doc') ||
        file.mimetype.includes('docx')
      )
    ) {
      throw new HttpException(
        'File type not supported',
        HttpStatus.BAD_REQUEST,
      );
    }
    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
    };
    const fileName = hashedFileName + extension;
    this.client.putObject(
      bucketName,
      fileName,
      file.buffer,
      metaData,
      function (err) {
        if (err) {
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );
    return {
      bucketName: bucketName,
      filename: fileName,
    };
  }

  async delete(objetName: string, bucketName: string) {
    this.client.removeObject(bucketName, objetName, function (err) {
      if (err)
        throw new HttpException(
          'An error occured when deleting!',
          HttpStatus.BAD_REQUEST,
        );
    });
  }
}
