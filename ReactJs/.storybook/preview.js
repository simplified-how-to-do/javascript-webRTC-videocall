import GlobalSyles from '../src/styles/global'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const decorators = [
  (Story) => (
    <>
      <GlobalSyles />
      <Story />
    </>
  )
]
