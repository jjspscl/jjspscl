import { TAG_COLORS } from "./tag.constant";
import type { TagColor } from "./tag.type";

export const getTagColor = (identifier?: string): TagColor => {
    if (!identifier) {
        return TAG_COLORS[0];
    }
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
        hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % TAG_COLORS.length;
    return TAG_COLORS[index];
};
