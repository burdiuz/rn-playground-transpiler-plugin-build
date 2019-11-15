import graphQLTag from 'babel-plugin-graphql-tag';

export * from 'babel-plugin-graphql-tag';

export const getRNPlaygroundPlugin = () => graphQLTag;

export const getRNPlaygroundPluginConfig = (config) => [graphQLTag, config];
