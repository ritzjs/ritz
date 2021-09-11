import pluginTester from 'babel-plugin-tester';
import RewriteImports from './rewrite-imports';

pluginTester({
  pluginName: RewriteImports.name,
  plugin: RewriteImports,
  tests: [
    {
      code: `import { useQuery } from 'ritz';`,
      output: `import { useQuery } from 'next/data-client';`,
    },
    {
      code: `import { Image } from 'ritz';`,
      output: `import { Image } from 'next/image';`,
    },
    {
      code: `import {Image, Link} from 'ritz';`,
      output: `
        import { Link } from 'next/link';
        import { Image } from 'next/image';
      `,
    },
    {
      code: `import {Image as RitzImage, Link} from 'ritz';`,
      output: `
        import { Link } from 'next/link';
        import { Image as RitzImage } from 'next/image';
      `,
    },
    {
      code: `import {Document, Html, DocumentHead, Main, RitzScript} from "ritz";`,
      output: `
        import { RitzScript } from 'next/document';
        import { Main } from 'next/document';
        import { DocumentHead } from 'next/document';
        import { Html } from 'next/document';
        import { Document } from 'next/document';
      `,
    },
  ],
});
