import { Injectable } from '@nestjs/common';
import { create } from 'ipfs-http-client';
import { fromString } from 'uint8arrays/from-string'

@Injectable()
export class IPFSClientService {
  private client = create({
    protocol: 'http',
    port: 5001
  });

  public async upload(base64_string: string): Promise<string> {
    const data = fromString(base64_string, 'base64')
    const { cid } = await this.client.add(data)
    return `https://cloudflare-ipfs.com/ipfs/${cid}}`
  }
}
