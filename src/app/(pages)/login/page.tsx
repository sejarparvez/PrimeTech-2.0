"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { AiFillFacebook } from "react-icons/ai";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

const AuthForm = () => {
  const [isSignUp, setSignUp] = useState(false);

  const handleSignUpClick = () => {
    setSignUp(true);
  };

  const handleSignInClick = () => {
    setSignUp(false);
  };

  return (
    <>
      <div
        className={`container relative mt-24 min-h-[30rem] w-[48rem] max-w-full overflow-hidden shadow-2xl ${
          isSignUp ? "right-panel-active" : ""
        }`}
        id="container"
      >
        <div className="sign-up-container opacity-1 trans absolute left-0 top-0 h-full w-1/2 transition-all duration-500 ease-in-out">
          <form
            action="#"
            className="flex h-full flex-col items-center justify-center bg-white py-16 text-center"
          >
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              className="my-3 bg-slate-100 px-4 py-3"
            />
            <input
              type="email"
              placeholder="Email"
              className="my-3 bg-slate-100 px-4 py-3"
            />
            <input
              type="password"
              placeholder="Password"
              className="my-3 bg-slate-100 px-4 py-3"
            />
            <Button>Sign Up</Button>
          </form>
        </div>
        <div className=" absolute left-0 top-0 z-20 h-full w-1/2 transition-all duration-300 ease-in-out">
          <form
            action="#"
            className="flex h-full flex-col items-center justify-center bg-white py-16 text-center"
          >
            <h1>Sign in</h1>
            <div className=" my-5 inline-flex gap-4">
              <Link href="#" className="rounded-full border p-3">
                <AiFillFacebook />
              </Link>
              <Link href="#" className="rounded-full border p-3">
                <FaTwitter />
              </Link>
              <Link href="#" className="rounded-full border p-3">
                <FaLinkedin />
              </Link>
            </div>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Email"
              className="my-3 bg-slate-100 px-4 py-3"
            />
            <input
              type="password"
              placeholder="Password"
              className="my-3 bg-slate-100 px-4 py-3"
            />
            <a href="#">Forgot your password?</a>
            <Button>Sign In</Button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay duration relative -left-full h-full w-[200%] translate-x-0 bg-gradient-to-b from-primary to-pink-500  text-white transition-transform duration-300 ease-in-out">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us, please login with your personal info
              </p>
              <Button onClick={handleSignInClick}>Sign In</Button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start a journey with us</p>
              <Button className="ghost" onClick={handleSignUpClick}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
