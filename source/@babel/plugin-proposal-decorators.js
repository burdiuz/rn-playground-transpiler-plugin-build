import decoratorsPlugin from '@babel/plugin-proposal-decorators';

export * from '@babel/plugin-proposal-decorators';

export const getRNPlaygroundPlugin = () => decoratorsPlugin;

export const getRNPlaygroundPluginConfig = (config = {}) => [
	decoratorsPlugin,
	{
		decoratorsBeforeExport: true,
		...config,
	},
];
