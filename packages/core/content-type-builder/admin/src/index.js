import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';

import PluginIcon from './components/PluginIcon';
import { PERMISSIONS } from './constants';
import pluginId from './pluginId';
import reducers from './reducers';
import formsAPI from './utils/formAPI';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addReducers(reducers);

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Content Types Builder',
      },
      permissions: PERMISSIONS.main,
      Component: () => import(/* webpackChunkName: "content-type-builder" */ './pages/App'),
    });

    app.registerPlugin({
      id: pluginId,
      name,
      // Internal APIs exposed by the CTB for the other plugins to use
      apis: {
        forms: formsAPI,
      },
    });
  },
  bootstrap() {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "content-type-builder-translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
