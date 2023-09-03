import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { login } from '../util/auth';

function LoginScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const userCredentials = await login(email, password);
      const token = userCredentials.token;
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        '로그인 실패!',
        '이메일 주소와 비밀번호를 확인해주세요'
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;