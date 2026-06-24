import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    // Wir reichen nur den slug weiter. 
    // Den Rest ziehen wir uns im Frontend direkt aus dem RAM.
    return { slug: params.slug };
};