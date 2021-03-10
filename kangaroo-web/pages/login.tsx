import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-pattern-light min-w-screen">
      <div>
        <div className="mb-8 text-center">
          <div className="mb-2 text-3xl font-extrabold tracking-wide">
            Sign in to Kangaroo
          </div>
          <div>
            Or register <b className="font-bold text-indigo-600">here.</b>
          </div>
        </div>
        <section className="p-8 bg-white border border-gray-300 rounded w-96">
          <div className="mb-2">
            <label className="block mb-1 font-semibold text-gray-600">
              Username
            </label>
            <InputText className="w-full p-inputtext-sm" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-600">
              Password
            </label>
            <InputText className="w-full p-inputtext-sm" type="password" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" />
              <div className="text-sm">Remember me.</div>
            </div>
            <div className="text-sm font-bold text-indigo-600">
              Forgot your password?
            </div>
          </div>
          <Button label="Sign in" className="w-full font-bold p-button-sm" />
        </section>
      </div>
    </div>
  );
};

export default Login;
