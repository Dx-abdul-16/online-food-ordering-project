import { Smartphone, Star } from "lucide-react";

const AppDownload = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
      <div className="container">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <h2 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl">
              Get the FoodExpress App
            </h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">
              Download our app for exclusive offers, faster ordering, and real-time order tracking.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 md:justify-start">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="text-sm text-primary-foreground/80">4.8 Rating</span>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-card transition-opacity hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                App Store
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-card transition-opacity hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                </svg>
                Play Store
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="flex h-64 w-64 items-center justify-center rounded-full bg-primary-foreground/10">
              <Smartphone className="h-32 w-32 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
