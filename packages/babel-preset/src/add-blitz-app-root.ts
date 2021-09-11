import { PluginObj } from '@babel/core';
import { getFileName, wrapExportDefaultDeclaration } from './utils';

function AddRitzAppRoot(): PluginObj {
  return {
    name: 'AddRitzAppRoot',
    visitor: {
      ExportDefaultDeclaration(path, state) {
        const filePath = getFileName(state);

        if (!filePath?.match(/_app\./)) {
          return;
        }

        wrapExportDefaultDeclaration(path, 'withRitzAppRoot', '@ritzjs/core');
      },
    },
  };
}

// eslint-disable-next-line import/no-default-export
export default AddRitzAppRoot;
