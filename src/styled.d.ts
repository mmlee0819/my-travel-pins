import "styled-components"

declare module "styled-components" {
  export interface DefaultTheme {
    title: { sm: string; md: string; lg: string }
    color: {
      deepMain: string
      lightMain: string
      bgDark: string
      bgLight: string
      lightGreen: string
      orange: string
    }
    btnColor: {
      bgGreen: string
      bgBlue: string
      bgGray: string
    }
    border: { commonRadius: string }
  }
}
