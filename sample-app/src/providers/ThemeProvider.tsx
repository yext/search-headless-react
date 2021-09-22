import { default as React, ReactChild, ReactChildren } from 'react';
import search_bar_styles from '../sass/SearchBar.module.scss';
import custom_styles from '../sass/Custom.module.scss';

const theme: Record<string, string> = {
  ...search_bar_styles,
};

Object.entries(custom_styles).forEach(([key, value]) => {
  if (key in theme) {
    theme[key] = `${theme[key]} ${value}`;
  } else {
    theme[key] = `${value}`;
  }
})


export const ThemeContext = React.createContext(theme);

interface Props {
  children?: ReactChildren | ReactChild | (ReactChildren | ReactChild)[],
}

export function ThemeProvider(props: Props): JSX.Element {
  const { children } = props;
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}
