import Link from "next/link";
import { BsFacebook } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Button } from "../ui/button";

export default function SocialLinks() {
  return (
    <section className="flex flex-col gap-8 [&>*]:text-gray-600 hover:[&>*]:text-primary">
      <Link
        href="https://facebook.com/sejarparvez"
        target="_blank"
        rel="noopener"
        title="Facebook"
      >
        <Button size="icon" variant="ghost">
          <BsFacebook size={28} />
        </Button>
      </Link>
      <Link
        href="https://twitter.com/sejarparvez"
        target="_blank"
        rel="noopener"
        title="Twitter"
      >
        <Button size="icon" variant="ghost">
          <FaXTwitter size={28} />
        </Button>
      </Link>
      <Link
        href="https://instagram.com/sejarparvez"
        target="_blank"
        rel="noopener"
        title="Instagram"
      >
        <Button size="icon" variant="ghost">
          <FaInstagram size={28} />
        </Button>
      </Link>
      <Link
        href="https://linkedin.com/in/sejarparvez"
        target="_blank"
        rel="noopener"
        title="Linkedin"
      >
        <Button size="icon" variant="ghost">
          <FaLinkedinIn size={28} />
        </Button>
      </Link>
      <Link
        href="https://github.com/sejarparvez"
        target="_blank"
        rel="noopener"
        title="Github"
      >
        <Button size="icon" variant="ghost">
          <FaGithub size={28} />
        </Button>
      </Link>
    </section>
  );
}
