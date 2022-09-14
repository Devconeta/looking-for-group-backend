import { Injectable } from '@nestjs/common';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { fromString } from 'uint8arrays/from-string'

@Injectable()
export class IPFSClientService {
  private client: IPFSHTTPClient;

  constructor() {
    this.client = create()
  }

  public async upload(base64_string: string): Promise<string> {
    const data = fromString(base64_string, 'base64')
    const { cid } = await this.client.add(data)
    return `https://cloudflare-ipfs.com/ipfs/${cid}`
  }
}
