import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";

function LoginForm() {
  const form = useForm();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/");
      } else {
        form.setError("email", { message: result.message || "Login failed" });
      }
    } catch (err) {
      form.setError("email", { message: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="you@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••••" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}

function SignupForm() {
  const form = useForm();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/");
      } else {
        form.setError("email", { message: result.message || "Signup failed" });
      }
    } catch (err) {
      form.setError("email", { message: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField name="fullName" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Your Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="you@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••••" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}

export default function LoginSignup() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {tab === 'login' ? 'Login to StudyMind AI' : 'Create your StudyMind AI account'}
          </CardTitle>
          <div className="flex justify-center mt-4 gap-2">
            <Button variant={tab === 'login' ? 'default' : 'ghost'} onClick={() => setTab('login')}>Login</Button>
            <Button variant={tab === 'signup' ? 'default' : 'ghost'} onClick={() => setTab('signup')}>Sign Up</Button>
          </div>
        </CardHeader>
        <CardContent>
          {tab === 'login' ? <LoginForm /> : <SignupForm />}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground mx-auto">StudyMind AI &copy; {new Date().getFullYear()}</p>
        </CardFooter>
      </Card>
    </div>
  );
} 