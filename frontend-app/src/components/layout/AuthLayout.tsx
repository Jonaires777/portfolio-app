import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import CommomFooter from "../common/CommomFooter";

type AuthLayoutProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <img src="/pngegg.png" alt="Insight Hub" className="w-10 h-10" />
            <span className="text-2xl font-semibold text-slate-900">
              Insight Hub
            </span>
          </Link>
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1 mb-0">{subtitle}</p>
            )}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
      <CommomFooter />
    </div>
  );
};

export default AuthLayout;
