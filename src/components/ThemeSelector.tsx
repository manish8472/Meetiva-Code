import { EuiThemeColorMode } from "@elastic/eui";
import React, { Suspense, useEffect, useState} from "react";

// Lazy-load theme components to improve performance
const LightTheme = React.lazy(() => import("./themes/LightTheme"));
const DarkTheme = React.lazy(() => import("./themes/DarkTheme"));

//

export default function ThemeSelector({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize theme state with default value (light)
  const [theme, setTheme] = useState<EuiThemeColorMode>("light");

  // Get theme from localStorage and set it in state
  useEffect(() => {
    const theme = localStorage.getItem("zoom-theme");
    if (theme) {
      setTheme(theme as EuiThemeColorMode);
    }
  }, []);

  // Render theme selector with suspense fallback
  return (
    <>
      <Suspense fallback={<></>}>
        {theme === "dark" ? <DarkTheme /> : <LightTheme />}
      </Suspense>
      {children}
    </>
  );
}
