/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import { FunctionComponent } from "react";

import type { SupabaseClient } from "@supabase/supabase-js";

import { Auth, Typography, Button } from "@supabase/ui";
import { supabase } from "../lib/supabase";

const { Text } = Typography;
const { UserContextProvider } = Auth;

const Profile: FunctionComponent<{
  supabaseClient: SupabaseClient;
}> = ({ supabaseClient, children }) => {
  const { user } = Auth.useUser();

  if (user) {
    return (
      <>
        <Text>Signeed in: {user?.email}</Text>
        <Button block onClick={() => supabaseClient.auth.signOut()}>
          Sign out
        </Button>
      </>
    );
  }

  // TUTORIAL MAKER RETURNED CHILDREN AND I DON'T KNOW WHY
  // TYPESCRIPT IS YELLING WHEN YOU DO THIS BECAUSE
  // THIS IS NOT FC ANYMORE IS YOU DO THAT

  // BUT WE NEED THIS SO I DECIDED TO USE FRAGMENT LIKE THIS

  return <>{children}</>;
};

const ProfilePage: FunctionComponent = () => {
  return (
    <div>
      <UserContextProvider supabaseClient={supabase}>
        <Profile supabaseClient={supabase}>
          <Auth supabaseClient={supabase} />
        </Profile>
      </UserContextProvider>
    </div>
  );
};

export default ProfilePage;
