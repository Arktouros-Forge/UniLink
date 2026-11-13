import { firebase as copy } from "@app/constants/auth.json";

const LOCAL_FALLBACK = [
  "auth/user-not-found",
  "auth/invalid-credential",
  "auth/wrong-password",
  "auth/invalid-login-credentials",
];

class FirebaseAuthError extends Error {
  constructor(code) {
    super(copy.errors[code] ?? copy.errors.fallback);
    this.code = code;
  }
}

export function useFirebaseAuth() {
  const config = useRuntimeConfig().public.firebase;
  const enabled = Boolean(config.apiKey && config.projectId);
  let sdk;

  const load = async () => {
    if (sdk) return sdk;
    const [{ initializeApp, getApps }, auth] = await Promise.all([
      import("firebase/app"),
      import("firebase/auth"),
    ]);
    const app = getApps()[0] ?? initializeApp(config);
    sdk = { ...auth, auth: auth.getAuth(app) };
    return sdk;
  };

  const guard = async (task) => {
    try {
      return await task(await load());
    } catch (error) {
      if (error?.code?.startsWith("auth/"))
        throw new FirebaseAuthError(error.code);
      throw error;
    }
  };

  const signInWithPassword = (email, password) =>
    guard(
      async ({ auth, signInWithEmailAndPassword }) =>
        (await signInWithEmailAndPassword(auth, email, password)).user,
    );

  const signInWithGoogle = () =>
    guard(async ({ auth, GoogleAuthProvider, signInWithPopup }) => {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      return (await signInWithPopup(auth, provider)).user;
    });

  const signUp = ({ name, email, password }) =>
    guard(
      async ({
        auth,
        createUserWithEmailAndPassword,
        updateProfile,
        sendEmailVerification,
      }) => {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(user, { displayName: name });
        await sendEmailVerification(user);
        return user;
      },
    );

  const resetPassword = (email) =>
    guard(({ auth, sendPasswordResetEmail }) =>
      sendPasswordResetEmail(auth, email),
    );

  const resendVerification = () =>
    guard(async ({ auth, sendEmailVerification }) => {
      if (!auth.currentUser) return false;
      await sendEmailVerification(auth.currentUser);
      return true;
    });

  const freshToken = () =>
    guard(async ({ auth }) => {
      if (!auth.currentUser) return null;
      await auth.currentUser.reload();
      return auth.currentUser.getIdToken(true);
    });

  const signOut = () =>
    sdk ? sdk.signOut(sdk.auth).catch(() => {}) : Promise.resolve();

  return {
    enabled,
    isCredentialError: (error) => LOCAL_FALLBACK.includes(error?.code),
    signInWithPassword,
    signInWithGoogle,
    signUp,
    resetPassword,
    resendVerification,
    freshToken,
    signOut,
  };
}
