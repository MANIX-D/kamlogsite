import { useTranslation } from 'react-i18next';

export const useMultilingualContent = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const getLocalizedField = <T extends Record<string, any>>(
    item: T,
    fieldName: string
  ): string => {
    const localizedKey = `${fieldName}_${currentLang}`;
    const fallbackKey = `${fieldName}_fr`;

    return item[localizedKey] || item[fallbackKey] || item[fieldName] || '';
  };

  return { getLocalizedField, currentLang };
};

export const getMultilingualValue = (
  item: Record<string, any>,
  fieldName: string,
  language: string
): string => {
  const localizedKey = `${fieldName}_${language}`;
  const fallbackKey = `${fieldName}_fr`;

  return item[localizedKey] || item[fallbackKey] || item[fieldName] || '';
};
