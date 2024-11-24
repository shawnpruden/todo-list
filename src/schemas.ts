import { z } from 'zod';
import { validatePassword } from './helpers';

const BaseAuthSchema = z.object({
  email: z
    .string()
    .email('無効なメールアドレスです。')
    .min(1, 'メールアドレスを入力してください。')
    .max(256, 'メールアドレスは256文字以内である必要があります。'),

  password: z
    .string()
    .min(1, 'パスワードを入力してください。')
    .min(8, 'パスワードは8文字以上である必要があります。')
    .refine(validatePassword, {
      message:
        'パスワードには少なくとも2文字の英語、2つの数字、および2つの特殊文字を含める必要があります。',
    }),
});

const LoginSchema = BaseAuthSchema.pick({
  email: true,
}).extend({
  password: z
    .string()
    .min(1, 'パスワードを入力してください。')
    .min(8, 'パスワードは8文字以上である必要があります。'),
});

const SignupSchema = BaseAuthSchema.extend({
  confirmPassword: z
    .string()
    .min(1, 'パスワード（確認用）を入力してください。'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'パスワードが一致する必要があります。',
});

const ResetPasswordSchema = BaseAuthSchema.omit({
  password: true,
});

export const AuthSchemas = {
  login: LoginSchema,
  signUp: SignupSchema,
  resetPassword: ResetPasswordSchema,
};
