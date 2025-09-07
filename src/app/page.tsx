"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, Clock, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b animate-fadeInDown">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">StudyHub</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Link href="/signup">
              <Button size="sm" className="hover:scale-105 transition-transform duration-200">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fadeInUp">
            Smart Notes with
            <span className="block text-primary">AI-Powered Insights</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-fadeInUp delay-100">
            Transform your learning experience with intelligent note-taking, AI summarization, 
            and collaborative study tools designed for modern students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-200">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto hover:scale-105 transition-transform duration-200">
                Start Taking Notes
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto hover:scale-105 transition-transform duration-200">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools to enhance your learning and productivity
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fadeInUp delay-100">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI Summarization</CardTitle>
                <CardDescription>
                  Automatically generate concise summaries of your notes with advanced AI technology
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fadeInUp delay-200">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Organization</CardTitle>
                <CardDescription>
                  Organize your notes with tags, categories, and intelligent search capabilities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fadeInUp delay-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Collaboration</CardTitle>
                <CardDescription>
                  Share and collaborate on notes with classmates and study groups
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fadeInUp delay-500">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-time Sync</CardTitle>
                <CardDescription>
                  Access your notes anywhere with real-time synchronization across all devices
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="text-center max-w-2xl mx-auto hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fadeInUp">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to get started?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of students who are already using StudyHub to improve their learning experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto hover:scale-105 transition-transform duration-200">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto hover:scale-105 transition-transform duration-200">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 animate-fadeIn">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-semibold">StudyHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Smart note-taking with AI-powered insights for modern students.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Account</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground transition-colors">Login</Link></li>
                <li><Link href="/signup" className="hover:text-foreground transition-colors">Sign Up</Link></li>
                <li><Link href="/profile" className="hover:text-foreground transition-colors">Profile</Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 StudyHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
