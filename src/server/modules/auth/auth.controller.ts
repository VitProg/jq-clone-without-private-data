import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common'
import { IUser } from '../../../common/forum/forum.base.interfaces'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard'
import { omit } from '../../../common/utils/object'
import { IRefreshTokenResponse } from '../../../common/responses/auth.responses'
import { ApiBasicAuth, ApiBearerAuth, ApiCookieAuth, ApiExcludeEndpoint, getSchemaPath, ApiResponse, ApiTags } from '@nestjs/swagger'
import { HttpGuard } from './guards/http.guard'
import { LoginResponse } from './responses/login.response'
import { RefreshTokenResponse } from './responses/refresh-token.response'


@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor (
    private readonly authService: AuthService,
  ) {
  }


  @UseGuards(HttpGuard)
  @Post('login')
  @ApiBasicAuth()
  async login (
    @Req() request: Request & { user: IUser },
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    const result = await this.authService.login(request)

    if (result.cookie) {
      const { name, ...options } = result.cookie
      response.cookie(name, result.refreshToken, options)
    }

    return omit(result, 'cookie', 'refreshToken')
  }


  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  async logout (
    @Req() request: Request & { user: IUser },
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.logout(request)

    if (result.cookie) {
      const { name, ...options } = result.cookie
      response.cookie(name, '', options)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @ApiBearerAuth()
  async logoutAll (
    @Req() request: Request & { user: IUser },
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.logoutAll(request)

    if (result.cookie) {
      const { name, ...options } = result.cookie
      response.cookie(name, '', options)
    }
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  @ApiCookieAuth('refreshToken')
  async refreshToken (
    @Req() request: Request & { user: IUser },
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponse> {
    const result = await this.authService.refreshToken(request)

    if (result.cookie) {
      const { name, ...options } = result.cookie
      response.cookie(name, result.refreshToken, options)
    }

    return omit(result, 'cookie', 'refreshToken')
  }

  @Post('smf')
  @ApiExcludeEndpoint(true)
  async smf (
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return request.cookies
    // if (result.cookie) {
    //   const {name, ...options} = result.cookie
    //   response.cookie(name, result.refreshToken, options)
    // }
    // return omit(result, 'cookie')

  }

}
