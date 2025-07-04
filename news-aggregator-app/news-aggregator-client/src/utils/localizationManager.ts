import localization from '../config/localization.json';
import logger from '../config/logger.js';

class LocalizationManager {
    public get(path: string, replacements?: Record<string, string>): string {
        const keys = path.split('.');
        let result: any = localization;
        for (const key of keys) {
            if (result[key] !== undefined) {
                result = result[key];
            } else {
                logger.warn(`String with path '${path}' not found in localization.json.`);
                return path;
            }
        }

        let str: string = result;
        if (replacements) {
            for (const placeholder in replacements) {
                str = str.replace(`{${placeholder}}`, replacements[placeholder]);
            }
        }
        return str;
    }
}

export default new LocalizationManager();