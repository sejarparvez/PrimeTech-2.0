import Link from "next/link";
import { BsFacebook } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import ToolTipHook from "../helper/ToolTipHook";

export default function SocialLinks() {
  return (
    <section className="flex flex-col gap-8 [&>*]:text-gray-600 hover:[&>*]:text-primary">
      <Link
        href="https://facebook.com/sejarparvez"
        target="_blank"
        rel="noopener"
      >
        <ToolTipHook text="Facebook" icon={<BsFacebook size={28} />} />
      </Link>
      <Link
        href="https://twitter.com/sejarparvez"
        target="_blank"
        rel="noopener"
      >
        <ToolTipHook text="Twitter" icon={<FaXTwitter size={28} />} />
      </Link>
      <Link
        href="https://instagram.com/sejarparvez"
        target="_blank"
        rel="noopener"
      >
        <ToolTipHook text="Instagram" icon={<FaInstagram size={28} />} />
      </Link>
      <Link
        href="https://linkedin.com/in/sejarparvez"
        target="_blank"
        rel="noopener"
      >
        <ToolTipHook text="Linkedin" icon={<FaLinkedinIn size={28} />} />
      </Link>
      <Link
        href="https://github.com/sejarparvez"
        target="_blank"
        rel="noopener"
      >
        <ToolTipHook text="GitHub" icon={<FaGithub size={28} />} />
      </Link>
    </section>
  );
}
