# I AM GOING TO USE SOME COMPONENTS FROM `'@supabase/ui'` PACKAGE


```
touch pages/profile.tsx
```

```tsx
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
      {/* USER PROVIDER (I CAN USE THIS PROVIDER ON ANY 
      PAGE OR COMPONENT WHERE I WANT TO PROVIDE USER (OR 
      EVERYWHERE I WANT TO CHECK IF USER EXITS OR NOT))  */}
      <UserContextProvider supabaseClient={supabase}>
        
        <Profile supabaseClient={supabase}>
          {/* THIS WILL RENDER FORMS (UI PROVIDED BY SUPABASE
          ) (ENDER THEM ONLY IF USER OESN'T EXIST) */}
          <Auth supabaseClient={supabase} />
        </Profile>
      </UserContextProvider>
    </div>
  );
};

export default ProfilePage;

```

