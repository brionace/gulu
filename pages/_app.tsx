import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "focus-visible/dist/focus-visible";
import { Roboto, Quattrocento } from "@next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const quattrocento = Quattrocento({
  weight: ["700"],
  style: ["normal"],
  subsets: ["latin"],
});

const breakpoints = {
  sm: "320px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
  "2xl": "1536px",
};

const theme = {
  styles: {
    global: (props: any) => ({
      "html, body": {
        fontSize: "md",
        FontFace: roboto.style.fontFamily,
        color: props.colorMode === "dark" ? "white" : "gray.600",
        lineHeight: "tall",
        // 'background-color': '#ff00009c',
      },
      h1: {
        FontFace: quattrocento.style.fontFamily,
      },
      // ".home_h1": {
      //   FontFace: quattrocento.style.fontFamily,
      // },
      // a: {
      //   color: props.colorMode === "dark" ? "gray.50" : "gray.700",
      // },
    }),
  },
};

const ex_theme = extendTheme({ ...theme, breakpoints });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <ChakraProvider theme={ex_theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ClerkProvider>
  );
}
