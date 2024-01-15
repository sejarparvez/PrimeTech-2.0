"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BsMoonStars } from "react-icons/bs";
import { MdOutlineWbSunny } from "react-icons/md";
import ToolTipHook from "../helper/ToolTipHook";
import { Label } from "../ui/label";

export default function ThemeSwitch() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleThemeToggle = () => {
    if (resolvedTheme === "system") {
      // If the system theme is light, switch to dark; otherwise, switch to light
      setTheme(theme === "light" ? "dark" : "light");
    } else {
      // If the theme is explicitly set, toggle between "light" and "dark"
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative flex flex-col items-center justify-center gap-5">
      <Label htmlFor="mode" onClick={handleThemeToggle}>
        <ToolTipHook
          icon={
            resolvedTheme === "light" ? (
              <MdOutlineWbSunny size={28} />
            ) : (
              <BsMoonStars size={28} />
            )
          }
          text="Change Theme"
        />
      </Label>
    </div>
  );
}
