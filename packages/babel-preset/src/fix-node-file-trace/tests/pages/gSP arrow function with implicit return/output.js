import { withFixNodeFileTrace as _withFixNodeFileTrace } from '@ritzjs/core/server';
export const getStaticProps = _withFixNodeFileTrace(() => ({
  props: {
    today: new Date(),
  },
}));
export default function IndexPage({ today }) {
  return JSON.stringify({
    today,
  });
}
