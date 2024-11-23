import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router';

function Auth() {
  const { pathname } = useLocation();

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[400px] p-8 bg-slate-50 rounded-md">
        <form className="">
          <h1 className="text-center mb-12">To-do List</h1>
          <h2 className="text-3xl font-light mb-4">
            {pathname === '/login' && 'ログイン'}
            {pathname === '/sign-up' && '新規登録'}
            {pathname === '/reset-password' && 'パスワード再設定'}
          </h2>

          <div className="flex flex-col gap-5 mb-2">
            <TextField
              type="email"
              fullWidth
              label="メールアドレス"
              variant="outlined"
            />

            {pathname !== '/reset-password' && (
              <TextField
                type="password"
                fullWidth
                label="パスワード"
                variant="outlined"
              />
            )}

            {pathname === '/sign-up' && (
              <TextField
                type="password"
                fullWidth
                label="パスワード（確認用）"
                variant="outlined"
              />
            )}
          </div>

          {pathname === '/login' && (
            <Link to="/reset-password" className="text-sm">
              パスワードをお忘れですか？
            </Link>
          )}

          <Button fullWidth size="large" variant="contained" sx={{ mt: 3 }}>
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

export default Auth;
