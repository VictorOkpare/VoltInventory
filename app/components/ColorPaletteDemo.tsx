'use client';

import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export default function ColorPaletteDemo() {
  return (
    <div className="min-h-screen bg-background p-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-foreground">
            Color Palette Demo
          </h1>
          <ThemeToggle />
        </div>

        {/* Palette Colors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Base Palette
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-royal-blue text-white p-6 rounded-lg shadow-md">
              <p className="font-bold">Royal Blue</p>
              <p className="text-sm">#162660</p>
              <p className="text-xs mt-2 opacity-75">var(--color-royal-blue)</p>
            </div>
            <div className="bg-powder-blue text-royal-blue p-6 rounded-lg shadow-md">
              <p className="font-bold">Powder Blue</p>
              <p className="text-sm">#D0E6FD</p>
              <p className="text-xs mt-2 opacity-75">var(--color-powder-blue)</p>
            </div>
            <div className="bg-warm-beige text-royal-blue p-6 rounded-lg shadow-md">
              <p className="font-bold">Warm Beige</p>
              <p className="text-sm">#F1E4D1</p>
              <p className="text-xs mt-2 opacity-75">var(--color-warm-beige)</p>
            </div>
          </div>
        </section>

        {/* Semantic Colors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Semantic Colors (Light/Dark Adaptive)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-background border border-foreground/10 p-6 rounded-lg shadow-sm">
              <p className="font-bold text-foreground">Background</p>
              <p className="text-sm text-muted-foreground">var(--color-background)</p>
            </div>
            <div className="bg-foreground p-6 rounded-lg shadow-sm">
              <p className="font-bold text-background">Foreground</p>
              <p className="text-sm text-background/80">var(--color-foreground)</p>
            </div>
            <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-sm">
              <p className="font-bold">Primary</p>
              <p className="text-sm opacity-90">var(--color-primary)</p>
            </div>
            <div className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-sm">
              <p className="font-bold">Secondary</p>
              <p className="text-sm opacity-90">var(--color-secondary)</p>
            </div>
             <div className="bg-muted text-muted-foreground p-6 rounded-lg shadow-sm">
              <p className="font-bold">Muted</p>
              <p className="text-sm opacity-90">var(--color-muted)</p>
            </div>
          </div>
        </section>

        {/* Component Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Component Examples
          </h2>

          {/* Buttons */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Buttons
            </h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium">
                Primary Button
              </button>
              <button className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity font-medium">
                Secondary Button
              </button>
              <button className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:opacity-90 transition-opacity font-medium">
                Muted Button
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Cards
            </h3>
            <div className="bg-background border border-foreground/10 p-6 max-w-md rounded-xl shadow-sm">
              <h4 className="text-lg font-bold text-foreground mb-2">
                Card Title
              </h4>
              <p className="text-muted-foreground">
                This is a card with the light/dark mode color scheme applied. It uses the background color and muted foreground text.
              </p>
              <div className="mt-4 flex justify-end">
                <button className="text-sm text-primary font-semibold hover:underline">Read more &rarr;</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
