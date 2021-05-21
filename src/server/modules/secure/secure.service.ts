import crypto, { BinaryLike } from 'crypto'
import ua from "useragent";
import GeoIpLite from "geoip-lite";
import { Request } from 'express';
import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core';


@Injectable()
// @Injectable({ scope: Scope.REQUEST })
export class SecureService {
  constructor (
    // @Inject(REQUEST) private request: Request
  ) {
  }

  sha1 (data: BinaryLike) {
    return crypto
      .createHash('sha1')
      .update(data)
      .digest('hex')
  }

  sha256 (data: BinaryLike) {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')

  }

  async generateFingerprintLight(request: Request) { //} = this.request) {
    const agent = ua.parse(request.header("user-agent"))

    const ip =
      (request.header("x-forwarded-for") ?? "").split(",").pop() ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      (request.connection as any)?.socket?.remoteAddress ||
      request.ip ||
      (request.ips && request.ips.length > 0 ? request.ips[0] : '127.0.0.1');

    const geo = GeoIpLite.lookup(ip);

    const data = {
      // acceptHeader: request.header('accept'),
      acceptLanguageHeader: request.header('accept-language'),
      userAgent: {
        browser: {
          family: agent.family,
          version: agent.major,
        },
        device: {
          family: agent.device.family,
          version: agent.device.major,
        },
        os: {
          family: agent.os.family,
          major: agent.os.major,
          minor: agent.os.minor,
        },
      },
      country: geo?.country,
    }
    const hash = this.sha256(JSON.stringify(data))

    return hash
  }

}
