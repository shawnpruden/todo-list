import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router';
import { z } from 'zod';
import { AuthSchemas } from '../schemas';

export default function Auth() {
  const { pathname } = useLocation();
  const formSchema = AuthSchemas[pathname.slice(1) as keyof typeof AuthSchemas];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    console.log(data);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[400px] p-8 bg-slate-50 rounded-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <h1 className="text-center mb-12">To-do List</h1>
          <h2 className="text-3xl font-light mb-4">
            {pathname === '/login' && 'ログイン'}
            {pathname === '/sign-up' && '新規登録'}
            {pathname === '/reset-password' && 'パスワード再設定'}
          </h2>

          <div className="flex flex-col gap-5 mb-2">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  type="email"
                  fullWidth
                  label="メールアドレス"
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...field}
                />
              )}
            />

            {pathname !== '/reset-password' && (
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="password"
                    fullWidth
                    label="パスワード"
                    variant="outlined"
                    error={'password' in errors && !!errors.password}
                    helperText={
                      'password' in errors ? errors.password?.message : ''
                    }
                    {...field}
                  />
                )}
              />
            )}

            {pathname === '/sign-up' && (
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="password"
                    fullWidth
                    label="パスワード（確認用）"
                    variant="outlined"
                    error={
                      'confirmPassword' in errors && !!errors.confirmPassword
                    }
                    helperText={
                      'confirmPassword' in errors
                        ? errors.confirmPassword?.message
                        : ''
                    }
                    {...field}
                  />
                )}
              />
            )}
          </div>

          {pathname === '/login' && (
            <Link to="/reset-password" className="text-sm">
              パスワードをお忘れですか？
            </Link>
          )}

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{ mt: 3 }}
          >
            続ける
          </Button>

          <p className="text-sm mt-4">
            <span>
              {pathname === '/sign-up'
                ? '既にアカウントをお持ちですか？'
                : 'アカウントは未登録ですか？'}
            </span>
            &nbsp;
            <Link to={pathname === '/sign-up' ? '/login' : '/sign-up'}>
              {pathname === '/sign-up' ? 'ログイン' : '新規登録'}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
