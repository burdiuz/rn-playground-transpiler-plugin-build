import styledComponents from 'babel-plugin-styled-components';

export * from 'babel-plugin-styled-components';

export const getRNPlaygroundPlugin = () => styledComponents;

export const getRNPlaygroundPluginConfig = (config) => [styledComponents, config];
