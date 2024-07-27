import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
  reputation: number;
}
interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;

  setHydrated: () => void;
  verifySession: () => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: AppwriteException }>;

  createAccount: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: AppwriteException }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set, get) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated: () =>
        set((state) => {
          state.hydrated = true;
        }),
      verifySession: async () => {
        try {
          const session = await account.getSession("current");
          set((state) => {
            state.session = session;
          });
        } catch (error) {
          console.error(error);
        }
      },
      login: async (email, password) => {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          if (!user.prefs?.reputation) {
            await account.updatePrefs({ reputation: 0 });
          }
          set((state) => {
            state.session = session;
            state.jwt = jwt;
            state.user = user;
          });
          return { success: true };
        } catch (error) {
          return { success: false, error: error as AppwriteException };
        }
      },
      createAccount: async (email, password, name) => {
        try {
          await account.create(ID.unique(), email, password, name);

          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          if (!user.prefs?.reputation) {
            await account.updatePrefs({ reputation: 0 });
          }
          set((state) => {
            state.session = session;
            state.jwt = jwt;
            state.user = user;
          });

          return { success: true };
        } catch (error) {
          return { success: false, error: error as AppwriteException };
        }
      },
      logout: async () => {
        try {
          await account.deleteSessions();
          set((state) => {
            state.session = null;
            state.jwt = null;
            state.user = null;
          });
          console.log(" Logged Out");
        } catch (error) {
          console.error(error);
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            state?.setHydrated();
          }
        };
      },
    }
  )
);
