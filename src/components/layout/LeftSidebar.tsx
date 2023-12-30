import SearchIcon from "./SearchIcon";
import SocialLinks from "./SocialLinks";
import ThemeSwitch from "./ThemeSwitch";

export default function LeftSidebar() {
  return (
    <div className="flex h-full w-20 flex-col items-center gap-16 pt-2">
      <SearchIcon />
      <ThemeSwitch />
      <SocialLinks />
    </div>
  );
}
