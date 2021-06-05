import { createGlobalStyle } from 'styled-components';

function colWidthOffset(device: 's' | 'm' | 'l') {
  let result = `
    .col.${device}0 {
      width: 0 !important;
      border: none !important;
      padding: 0 !important;
      margin: 0 !important;
      overflow: hidden !important;
      display: hidden !important;
    }
  `;

  for (let index = 1; index <= 12; index++) {
    const thisSize = `calc((100% / 12) * ${index})`;
    result += `
    .col.${device}${index} {
      width: ${thisSize};
    }
    .col.ml-${device}${index} {
      margin-left: ${thisSize};
    }
    .col.mr-${device}${index} {
      margin-right: ${thisSize};
    }
  `;
  }

  return result;
}

export default createGlobalStyle`
  *,
  *::after,
  *::before {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  html, body, #__next {
    height: 100%;
  }

  body {
    -webkit-font-smoothing: antialiased;
    font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

    /* transition: all 0.25s linear; */
  }

  button {
    cursor: pointer;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    @media (max-width: 640px) {
      ${colWidthOffset('s')}
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      ${colWidthOffset('m')}
    }

    @media (min-width: 1025px) {
      ${colWidthOffset('l')}
    }
  }

  .row:not(.noTransition) {
    .col {
      transition: width 0.2ms;
    }
  }
`;
