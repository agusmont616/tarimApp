# Graph Report - .  (2026-07-06)

## Corpus Check
- 50 files · ~53,629 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 198 nodes · 270 edges · 34 communities (11 shown, 23 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.86)
- Token cost: 486,753 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Screens & Web Tab Navigation|Screens & Web Tab Navigation]]
- [[_COMMUNITY_Expo App Config|Expo App Config]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Project Docs & Root Config|Project Docs & Root Config]]
- [[_COMMUNITY_Animated Splash Icon|Animated Splash Icon]]
- [[_COMMUNITY_Package Scripts & Dev Deps|Package Scripts & Dev Deps]]
- [[_COMMUNITY_Theming System|Theming System]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Expo Icon Design Config|Expo Icon Design Config]]
- [[_COMMUNITY_Web Tutorial Screenshot|Web Tutorial Screenshot]]
- [[_COMMUNITY_VS Code Editor Settings|VS Code Editor Settings]]
- [[_COMMUNITY_Claude Plugin Settings|Claude Plugin Settings]]
- [[_COMMUNITY_Expo Badge Assets|Expo Badge Assets]]
- [[_COMMUNITY_VS Code Extensions|VS Code Extensions]]
- [[_COMMUNITY_Editor Config Duplicate|Editor Config Duplicate]]
- [[_COMMUNITY_Expo Symbol Asset|Expo Symbol Asset]]
- [[_COMMUNITY_Icon Design Grid|Icon Design Grid]]
- [[_COMMUNITY_Android Icon Background|Android Icon Background]]
- [[_COMMUNITY_Android Icon Foreground|Android Icon Foreground]]
- [[_COMMUNITY_Android Icon Monochrome|Android Icon Monochrome]]
- [[_COMMUNITY_Expo Logo Asset|Expo Logo Asset]]
- [[_COMMUNITY_Favicon Asset|Favicon Asset]]
- [[_COMMUNITY_App Icon Asset|App Icon Asset]]
- [[_COMMUNITY_Logo Glow Asset|Logo Glow Asset]]
- [[_COMMUNITY_React Logo Asset (2x)|React Logo Asset (2x)]]
- [[_COMMUNITY_React Logo Asset (3x)|React Logo Asset (3x)]]
- [[_COMMUNITY_React Logo Asset|React Logo Asset]]
- [[_COMMUNITY_Splash Icon Asset|Splash Icon Asset]]
- [[_COMMUNITY_Explore Tab Icon (2x)|Explore Tab Icon (2x)]]
- [[_COMMUNITY_Explore Tab Icon (3x)|Explore Tab Icon (3x)]]
- [[_COMMUNITY_Explore Tab Icon|Explore Tab Icon]]
- [[_COMMUNITY_Home Tab Icon (2x)|Home Tab Icon (2x)]]
- [[_COMMUNITY_Home Tab Icon (3x)|Home Tab Icon (3x)]]
- [[_COMMUNITY_Home Tab Icon|Home Tab Icon]]

## God Nodes (most connected - your core abstractions)
1. `ThemedText()` - 14 edges
2. `expo` - 13 edges
3. `ThemedView()` - 13 edges
4. `useTheme()` - 12 edges
5. `Spacing` - 11 edges
6. `CustomTabList()` - 9 edges
7. `scripts` - 7 edges
8. `WebBadge()` - 7 edges
9. `Colors` - 7 edges
10. `useColorScheme()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AGENTS.md (Expo v57 docs directive)` --rationale_for--> `app.json (Expo app configuration)`  [INFERRED]
  AGENTS.md → app.json
- `README.md (Expo app onboarding guide)` --references--> `moveDirectories()`  [EXTRACTED]
  README.md → scripts/reset-project.js
- `.claude/settings.json (Expo plugin config)` --conceptually_related_to--> `app.json (Expo app configuration)`  [AMBIGUOUS]
  .claude/settings.json → app.json
- `README.md (Expo app onboarding guide)` --references--> `package.json (tarimapp project manifest)`  [EXTRACTED]
  README.md → package.json
- `TabLayout()` --calls--> `useColorScheme()`  [INFERRED]
  src/app/_layout.tsx → src/hooks/use-color-scheme.web.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Expo Router file-based routing (layout + two tab screens)** — app__layout_tablayout, app_index_homescreen, app_explore_tabtwoscreen [EXTRACTED 1.00]
- **Core Expo project configuration files defining the app build** — app_config, package_config, tsconfig_config [INFERRED 0.85]
- **Reset-project workflow: npm script, script implementation, and documentation** — package_config, scripts_reset_project_movedirectories, readme_doc [EXTRACTED 1.00]
- **Themed component styling pattern (useTheme + Colors driving ThemedText/ThemedView)** — components_themed_text_themedtext, components_themed_view_themedview, hooks_use_theme_usetheme, constants_theme_colors [INFERRED 0.90]
- **Expo .tsx/.web.tsx platform-specific file split pattern** — components_animated_icon_animatedicon, components_app_tabs_apptabs, hooks_use_color_scheme_usecolorscheme [INFERRED 0.85]
- **Web tab navigation composition (AppTabs -> CustomTabList -> TabButton)** — components_app_tabs_web_apptabs, components_app_tabs_web_customtablist, components_app_tabs_web_tabbutton [EXTRACTED 1.00]

## Communities (34 total, 23 thin omitted)

### Community 0 - "Screens & Web Tab Navigation"
Cohesion: 0.17
Nodes (25): styles, styles, AppTabs(), CustomTabList(), styles, TabButton(), ExternalLink(), Props (+17 more)

### Community 1 - "Expo App Config"
Cohesion: 0.08
Nodes (24): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, reactCompiler, typedRoutes (+16 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.08
Nodes (24): dependencies, expo, expo-constants, expo-device, expo-font, expo-glass-effect, expo-image, expo-linking (+16 more)

### Community 3 - "Project Docs & Root Config"
Cohesion: 0.11
Nodes (20): AGENTS.md (Expo v57 docs directive), TabLayout() root layout component, app.json (Expo app configuration), TabTwoScreen(), getDevMenuHint(), HomeScreen(), CLAUDE.md (includes AGENTS.md), .claude/settings.json (Expo plugin config) (+12 more)

### Community 4 - "Animated Splash Icon"
Cohesion: 0.14
Nodes (13): TabLayout(), AnimatedIcon(), AnimatedSplashOverlay(), glowKeyframe, keyframe, logoKeyframe, styles, AnimatedIcon() (+5 more)

### Community 5 - "Package Scripts & Dev Deps"
Cohesion: 0.13
Nodes (14): devDependencies, @types/react, typescript, main, name, private, scripts, android (+6 more)

### Community 6 - "Theming System"
Cohesion: 0.36
Nodes (5): AppTabs(), Colors, useColorScheme (native re-export), useColorScheme(), useTheme()

### Community 7 - "TypeScript Config"
Cohesion: 0.25
Nodes (7): compilerOptions, paths, strict, extends, include, @/*, @/assets/*

### Community 8 - "Expo Icon Design Config"
Cohesion: 0.29
Nodes (6): fill, automatic-gradient, groups, supported-platforms, circles, squares

### Community 9 - "Web Tutorial Screenshot"
Cohesion: 0.50
Nodes (5): Expo Logo Icon, Expo Starter Web App, http://localhost:8081/, Home / Explore / Doc Navigation Bar, Tutorial Web Screenshot

### Community 10 - "VS Code Editor Settings"
Cohesion: 0.40
Nodes (4): editor.codeActionsOnSave, source.fixAll, source.organizeImports, source.sortMembers

## Ambiguous Edges - Review These
- `.claude/settings.json (Expo plugin config)` → `app.json (Expo app configuration)`  [AMBIGUOUS]
  .claude/settings.json · relation: conceptually_related_to

## Knowledge Gaps
- **121 isolated node(s):** `expo@claude-plugins-official`, `recommendations`, `source.fixAll`, `source.organizeImports`, `source.sortMembers` (+116 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `.claude/settings.json (Expo plugin config)` and `app.json (Expo app configuration)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `HomeScreen()` connect `Project Docs & Root Config` to `Screens & Web Tab Navigation`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies` to `Package Scripts & Dev Deps`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `expo@claude-plugins-official`, `recommendations`, `source.fixAll` to the rest of the system?**
  _121 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Expo App Config` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Project Docs & Root Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10952380952380952 - nodes in this community are weakly interconnected._