import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user-dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Login an existing user and generate tokens' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in. Returns access and refresh tokens.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
  })
  async login(@Req() req) {
    const user: User = req.user;
    // Generate access token and refresh token
    const accessToken = await this.authService.generateAccessToken({
      deviceId: user.deviceId,
      id: user.id,
      role: user.role,
    });

    const refreshToken = await this.authService.generateRefreshToken({
      id: user.id,
    });

    // Update user with the new refresh token
    user.refreshToken = refreshToken;
    await this.userRepository.save(user); // Ensure you're using the correct entity method for saving

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user
    };
  }
}
