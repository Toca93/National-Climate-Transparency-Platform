import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { UserState } from '../../enums/user.enum';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
    constructor(
        private configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.refreshSecret'),
        });
    }

    async validate(payload: any) {
        const user = await this.userService.getUserCredentials(payload.un);
        if (user.state !== UserState.ACTIVE) {
            throw new UnauthorizedException('user deactivated');
        }
        return { id: user.id, username: payload.un };
    }
}