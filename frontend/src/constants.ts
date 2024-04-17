// Data defined in Storyblok at 

import { useStoryblokApi } from '@storyblok/astro';
const storyblokApi = useStoryblokApi();

const { data } = await storyblokApi.get(`cdn/datasource_entries`, {
	datasource: 'site-consts'
});

export const SITE_TITLE = data.datasource_entries.filter((object: any) => object.name === 'SITE_TITLE')[0].value;
export const SITE_DESCRIPTION = data.datasource_entries.filter((object: any) => object.name === 'SITE_DESCRIPTION')[0].value;