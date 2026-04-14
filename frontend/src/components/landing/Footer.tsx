import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-16 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <img src="/assets/Logos/logo icon/lumio icon white.png" alt="Lumio" className="w-5 h-5 object-contain" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">lumio</span>
            </div>
            <p className="text-sm opacity-60 font-body max-w-sm leading-relaxed">
              AI-powered ADHD early detection and learning support. Connecting students, teachers, and parents in a unified ecosystem.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm mb-4 opacity-80">Product</h4>
            <ul className="space-y-2.5 text-sm font-body opacity-60">
              <li><a href="#features" className="hover:opacity-100 transition-opacity">Features</a></li>
              <li><Link to="/pricing" className="hover:opacity-100 transition-opacity">Pricing</Link></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm mb-4 opacity-80">Company</h4>
            <ul className="space-y-2.5 text-sm font-body opacity-60">
              <li><a href="#about" className="hover:opacity-100 transition-opacity">About</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Contact</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-background/10 text-center text-xs font-body opacity-40">
          © 2026 Lumio. All rights reserved. Built by Team Unblur.
        </div>
      </div>
    </footer>
  );
}
