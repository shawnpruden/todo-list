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

const AuthContext = createContext<unknown>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSignUp = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, 'users', user.uid), {});

      setUser(user);

      navigate(-1);

      setIsLoading(false);

      sendEmailVerification(auth.currentUser as User);
    } catch (err) {
      setError(
        'このメールアドレスはすでに登録されています。パスワードを忘れた場合は、「パスワードをお忘れですか？」をクリックしてリセットするか、新しいアカウントを作成してください。'
      );

      if (err instanceof Error) {
        console.log(err.message);
      }

      setIsLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      setUser(user);

      navigate(-1);

      setIsLoading(false);
    } catch (err) {
      setError(
        'メールアドレスとパスワードの組み合わせが正しくありません。もう一度お試しいただくか、「パスワードをお忘れですか？」をクリックしてリセットしてください。'
      );

      if (err instanceof Error) {
        console.log(err.message);
      }

      setIsLoading(false);
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

  const handleReset = async (email: string) => {
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);

      setError(
        'パスワードリセット用のリンクを送信しました。しばらくしても届かない場合は、迷惑メールフォルダを確認するか、もう一度お試しください。'
      );

      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }

      setIsLoading(false);
    }
  };

  const handleClearError = () => setError(null);

  const memoedValue = useMemo(
    () => ({
      error,
      isLoading,
      user,
      handleSignUp,
      handleSignIn,
      handleSignOut,
      handleReset,
      handleClearError,
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [error, isLoading, user]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default function useAuth() {
  return useContext(AuthContext);
}
