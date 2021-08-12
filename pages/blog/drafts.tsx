/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FunctionComponent } from "react";
// UVESCU, NEKE TYPE-OVE KOJI SE TICU getServerSideProps-A
import type { GetServerSideProps } from "next";

interface PropsI {
  placeholder: boolean;
}

const IndexPage: FunctionComponent<PropsI> = (props) => {
  //

  console.log(props);

  return <div>🦉</div>;
};

export const getServerSideProps: GetServerSideProps<PropsI> = async (ctx) => {
  return {
    props: {
      placeholder: true,
    },
  };
};

export default IndexPage;
