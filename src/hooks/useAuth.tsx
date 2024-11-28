import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router';
import { auth, db } from '../firebase';
import { z } from 'zod';
import { AuthSchemas } from '../schemas';
import { toast } from 'sonner';

type AuthContextType = {
  isLoading: boolean;
  user: User | null;
  handleSignup: (values: z.infer<(typeof AuthSchemas)['sign-up']>) => void;
  handleLogin: (values: z.infer<typeof AuthSchemas.login>) => void;
  handleSignOut: () => void;
  handleReset: (
    values: z.infer<(typeof AuthSchemas)['reset-password']>
  ) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);

        setIsLoading(false);
      } else {
        setUser(null);

        setIsLoading(false);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const handleSignup = async (
    values: z.infer<(typeof AuthSchemas)['sign-up']>
  ) => {
    setIsLoading(true);

    const validatedFields = AuthSchemas['sign-up'].safeParse(values);

    if (validatedFields.success) {
      const { email, password } = validatedFields.data;

      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await setDoc(doc(db, 'users', user.uid), {});

        setUser(user);

        navigate('/dashboard');

        setIsLoading(false);

        sendEmailVerification(auth.currentUser as User);
      } catch (err) {
        toast.error(
          'このメールアドレスはすでに登録されています。パスワードを忘れた場合は、「パスワードをお忘れですか？」をクリックしてリセットするか、新しいアカウントを作成してください。'
        );

        if (err instanceof Error) {
          console.log(err.message);
        }

        setIsLoading(false);
      }
    } else {
      console.error(validatedFields.error);
    }
  };

  const handleLogin = async (values: z.infer<typeof AuthSchemas.login>) => {
    setIsLoading(true);

    const validatedFields = AuthSchemas.login.safeParse(values);

    if (validatedFields.success) {
      const { email, password } = validatedFields.data;

      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        setUser(user);

        navigate('/dashboard');

        setIsLoading(false);
      } catch (err) {
        toast.error(
          'メールアドレスとパスワードの組み合わせが正しくありません。もう一度お試しいただくか、「パスワードをお忘れですか？」をクリックしてリセットしてください。'
        );

        if (err instanceof Error) {
          console.log(err.message);
        }

        setIsLoading(false);
      }
    } else {
      console.error(validatedFields.error);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      await signOut(auth);

      setUser(null);

      navigate('/login');

      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }

      setIsLoading(false);
    }
  };

  const handleReset = async (
    values: z.infer<(typeof AuthSchemas)['reset-password']>
  ) => {
    setIsLoading(true);

    const validatedFields = AuthSchemas['reset-password'].safeParse(values);

    if (validatedFields.success) {
      const { email } = validatedFields.data;

      try {
        await sendPasswordResetEmail(auth, email);

        toast.success(
          'パスワードリセット用のリンクを送信しました。しばらくしても届かない場合は、迷惑メールフォルダを確認するか、もう一度お試しください。'
        );

        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }

        setIsLoading(false);
      }
    } else {
      console.error(validatedFields.error);
    }
  };

  const memoedValue = useMemo(
    () => ({
      isLoading,
      user,
      handleSignup,
      handleLogin,
      handleSignOut,
      handleReset,
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, user]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}
