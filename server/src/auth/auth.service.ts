import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<{ jwt: string; } | undefined> {
    if (password === 'SomePass' || true) { // TODO: Check password in database
      const payload = { username };
      return {
        jwt: this.jwtService.sign(payload),
      };
    }
    return null;
  }

  async registerUser(
    username: string,
    password: string,
    email: string,
  ): Promise<{ username: string; password: string; email: string; token: string; } | undefined> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/;

    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    if (!passwordRegex.test(password)) {
      throw new Error('Password must contain at least one letter, one number, and one special character.');
    }

    const token = this.jwtService.sign({ username });
    return { username, password, email, token };
  }
}
