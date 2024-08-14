import LocalizedStrings from 'react-native-localization';
import * as EN_STRINGS from './langFiles/en.json';
import * as JP_STRINGS from './langFiles/jp.json';
import * as ES_STRINGS from './langFiles/es.json';
import * as HI_STRINGS from './langFiles/hi.json';

export const STRINGS = new LocalizedStrings({
  'en-US': EN_STRINGS,
  'ja-JP': JP_STRINGS,
  'es-ES': ES_STRINGS,
  'hi-IN': HI_STRINGS,
});

export const convertCatLang = (STRING: typeof STRINGS, category: string) => {
  return (
    STRING?.[category] ?? category[0].toLocaleUpperCase() + category.slice(1)
  );
};

export const convertNotificationText = (
  STRING: typeof STRINGS,
  category: string,
  type: 1 | 2,
  percentage?: number,
) => {
  if (type === 1) {
    if (percentage) {
      if (STRINGS.getLanguage() === 'ja-JP') {
        return `${convertCatLang(
          STRING,
          category.toLowerCase(),
        )}予算の${percentage}%を超えました`;
      } else if (STRINGS.getLanguage() === 'es-ES') {
        return `Se ha superado el ${percentage}% del presupuesto de ${convertCatLang(
          STRING,
          category.toLowerCase(),
        )}`;
      } else if (STRINGS.getLanguage() === 'hi-IN') {
        return `${convertCatLang(
          STRING,
          category.toLowerCase(),
        )} के बजट का ${percentage}% पार कर गया`;
      } else {
        return `Exceeded ${percentage}% of ${convertCatLang(
          STRING,
          category.toLowerCase(),
        )} budget`;
      }
    } else {
      if (STRINGS.getLanguage() === 'ja-JP') {
        return `${convertCatLang(
          STRING,
          category.toLowerCase(),
        )}予算の制限を超えました`;
      } else if (STRINGS.getLanguage() === 'es-ES') {
        return `Límite del presupuesto de ${convertCatLang(
          STRING,
          category.toLowerCase(),
        )} superado`;
      } else if (STRINGS.getLanguage() === 'hi-IN') {
        return `${convertCatLang(
          STRING,
          category.toLowerCase(),
        )} बजट सीमा पार कर गई`;
      } else {
        return `${convertCatLang(
          STRING,
          category.toLowerCase(),
        )} Budget Limit Exceeded`;
      }
    }
  } else if (type === 2) {
    if (percentage) {
      if (STRINGS.getLanguage() === 'ja-JP') {
        return `${convertCatLang(
          STRING,
          category.toLowerCase(),
        )}予算の${percentage}%を超えました。軌道に乗るために対策を講じてください。`;
      } else if (STRINGS.getLanguage() === 'es-ES') {
        return `Has superado el ${percentage}% de tu presupuesto de ${convertCatLang(
          STRING,
          category.toLowerCase(),
        )}. Toma medidas para mantenerte en el camino.`;
      } else if (STRINGS.getLanguage() === 'hi-IN') {
        return `${convertCatLang(
          STRING,
          category.toLowerCase(),
        )} के बजट का ${percentage}% पार कर गया। ट्रैक पर बने रहने के लिए कार्रवाई करें।`;
      } else {
        return `You've exceeded ${percentage}% of your ${convertCatLang(
          STRING,
          category.toLowerCase(),
        )} budget. Take action to stay on track.`;
      }
    } else {
      if (STRINGS.getLanguage() === 'ja-JP') {
        return `${convertCatLang(
          STRING,
          category.toLowerCase(),
        )}予算が限度を超えました`;
      } else if (STRINGS.getLanguage() === 'es-ES') {
        return `Tu presupuesto de ${convertCatLang(
          STRING,
          category.toLowerCase(),
        )} ha superado el límite`;
      } else if (STRINGS.getLanguage() === 'hi-IN') {
        return `${convertCatLang(
          STRING,
          category.toLowerCase(),
        )} का बजट सीमा पार कर गया है`;
      } else {
        return `Your ${convertCatLang(
          STRING,
          category.toLowerCase(),
        )} budget has exceeded the limit`;
      }
    }
  }
};
