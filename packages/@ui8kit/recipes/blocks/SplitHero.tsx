import * as React from "react";
import { Block, Stack, Grid, Group, Title, Text, Badge, Button, Image, Icon, Box } from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";
const currentTheme = skyOSTheme;
const theme = { theme: currentTheme, themeRounded: currentTheme.rounded, themeButtonSize: currentTheme.buttonSize };

export const SplitHero = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
  return (
  <section data-class="split-hero">
    <div data-class="split-grid">
      <div data-class="split-hero-media">

      </div>
      <div data-class="split-hero-content">
        <div data-class="split-hero-badge">

        </div>
        <h1 data-class="split-hero-title">

        </h1>
        <p data-class="split-hero-description">

        </p>
        <div data-class="split-hero-actions">

        </div>
      </div>
    </div>
  </section>
  );
});
SplitHero.displayName = "SplitHero";
