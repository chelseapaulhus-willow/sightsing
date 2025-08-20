import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  return (
    <div className="mx-auto max-w-md p-6">
      <div className="card p-6 space-y-6">
        <div className="mx-auto text-5xl">🎵</div>
        <h1 className="text-center text-3xl font-bold">Welcome to SightSing</h1>
        <p className="text-center text-gray-600">
          Start your musical journey today!
        </p>
        <div className="space-y-3">
          <input className="w-full rounded-xl border p-3" placeholder="Email" />
          <input className="w-full rounded-xl border p-3" placeholder="Password" type="password" />
          <button className="btn btn-primary w-full" onClick={() => nav("/home")}>
            Continue Learning 🎵
          </button>
          <button className="btn btn-ghost w-full">Continue with Google</button>
        </div>
        <div className="text-center text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
