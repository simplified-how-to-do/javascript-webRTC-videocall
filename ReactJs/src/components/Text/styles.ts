import styled from 'styled-components';

interface TextStyleProps {
  lines?: number;
  lineHeight?: number;
  fixedHeight?: boolean;
}

export const Container = styled.div.attrs((props: TextStyleProps) => props)`
  text-align: justify;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;

  -webkit-line-clamp: ${(props) => props?.lines || 1};

  line-height: ${(props) => props.lineHeight || 1.2};

  ${(props) => {
    if (props?.fixedHeight) {
      const lineHeight = props?.lineHeight || 1.2;
      const lines = props?.lines || 1;
      const thisHeight = `${lineHeight * lines}em`;
      return `height: ${thisHeight};`;
    }
  }}
`;
