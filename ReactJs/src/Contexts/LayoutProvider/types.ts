export type languageType = 'pt-br' | 'en';
export type ThemeType = 'lightTheme' | 'darkTheme';

export interface ILayoutContext {
  adminActions: {
    contentEditor?: boolean;
  };
  language: languageType;
  setLanguage(language: languageType): void;
  theme: ThemeType;
  setTheme(theme: ThemeType): void;
}
