import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { createUser } from '../util/auth';

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const userCredentials = await createUser(email, password);
      const token = userCredentials.token;
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        '회원가입 실패!',
        '이메일 주소와 비밀번호를 확인해 주세요'
      );
      setIsAuthenticating(false);
      console.log(error);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return (
    <AuthContent onAuthenticate={signupHandler} />
    );
}

export default SignupScreen;