import { rankWith, schemaMatches, type ControlProps, type JsonSchema, type RankedTester } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import Autocomplete from '@mui/material/Autocomplete';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';

/**
 * Full ISO 639-1 language code list (code -> English name).
 * Source: ISO 639-1 standard (two-letter codes).
 */
export const ISO_639_1_LANGUAGES: Record<string, string> = {
  aa: 'Afar',
  ab: 'Abkhazian',
  ae: 'Avestan',
  af: 'Afrikaans',
  ak: 'Akan',
  am: 'Amharic',
  an: 'Aragonese',
  ar: 'Arabic',
  as: 'Assamese',
  av: 'Avaric',
  ay: 'Aymara',
  az: 'Azerbaijani',
  ba: 'Bashkir',
  be: 'Belarusian',
  bg: 'Bulgarian',
  bh: 'Bihari languages',
  bi: 'Bislama',
  bm: 'Bambara',
  bn: 'Bengali',
  bo: 'Tibetan',
  br: 'Breton',
  bs: 'Bosnian',
  ca: 'Catalan, Valencian',
  ce: 'Chechen',
  ch: 'Chamorro',
  co: 'Corsican',
  cr: 'Cree',
  cs: 'Czech',
  cu: 'Church Slavic, Old Slavonic, Church Slavonic, Old Bulgarian, Old Church Slavonic',
  cv: 'Chuvash',
  cy: 'Welsh',
  da: 'Danish',
  de: 'German',
  dv: 'Divehi, Dhivehi, Maldivian',
  dz: 'Dzongkha',
  ee: 'Ewe',
  el: 'Greek, Modern (1453-)',
  en: 'English',
  eo: 'Esperanto',
  es: 'Spanish, Castilian',
  et: 'Estonian',
  eu: 'Basque',
  fa: 'Persian',
  ff: 'Fulah',
  fi: 'Finnish',
  fj: 'Fijian',
  fo: 'Faroese',
  fr: 'French',
  fy: 'Western Frisian',
  ga: 'Irish',
  gd: 'Gaelic, Scottish Gaelic',
  gl: 'Galician',
  gn: 'Guarani',
  gu: 'Gujarati',
  gv: 'Manx',
  ha: 'Hausa',
  he: 'Hebrew',
  hi: 'Hindi',
  ho: 'Hiri Motu',
  hr: 'Croatian',
  ht: 'Haitian, Haitian Creole',
  hu: 'Hungarian',
  hy: 'Armenian',
  hz: 'Herero',
  ia: 'Interlingua (International Auxiliary Language Association)',
  id: 'Indonesian',
  ie: 'Interlingue, Occidental',
  ig: 'Igbo',
  ii: 'Sichuan Yi, Nuosu',
  ik: 'Inupiaq',
  io: 'Ido',
  is: 'Icelandic',
  it: 'Italian',
  iu: 'Inuktitut',
  ja: 'Japanese',
  jv: 'Javanese',
  ka: 'Georgian',
  kg: 'Kongo',
  ki: 'Kikuyu, Gikuyu',
  kj: 'Kuanyama, Kwanyama',
  kk: 'Kazakh',
  kl: 'Kalaallisut, Greenlandic',
  km: 'Central Khmer',
  kn: 'Kannada',
  ko: 'Korean',
  kr: 'Kanuri',
  ks: 'Kashmiri',
  ku: 'Kurdish',
  kv: 'Komi',
  kw: 'Cornish',
  ky: 'Kirghiz, Kyrgyz',
  la: 'Latin',
  lb: 'Luxembourgish, Letzeburgesch',
  lg: 'Ganda',
  li: 'Limburgan, Limburger, Limburgish',
  ln: 'Lingala',
  lo: 'Lao',
  lt: 'Lithuanian',
  lu: 'Luba-Katanga',
  lv: 'Latvian',
  mg: 'Malagasy',
  mh: 'Marshallese',
  mi: 'Maori',
  mk: 'Macedonian',
  ml: 'Malayalam',
  mn: 'Mongolian',
  mr: 'Marathi',
  ms: 'Malay',
  mt: 'Maltese',
  my: 'Burmese',
  na: 'Nauru',
  nb: 'Norwegian Bokmål',
  nd: 'Ndebele, North',
  ne: 'Nepali',
  ng: 'Ndonga',
  nl: 'Dutch, Flemish',
  nn: 'Norwegian Nynorsk',
  no: 'Norwegian',
  nr: 'Ndebele, South',
  nv: 'Navajo, Navaho',
  ny: 'Chichewa, Chewa, Nyanja',
  oc: 'Occitan',
  oj: 'Ojibwa',
  om: 'Oromo',
  or: 'Oriya',
  os: 'Ossetian, Ossetic',
  pa: 'Panjabi, Punjabi',
  pi: 'Pali',
  pl: 'Polish',
  ps: 'Pashto, Pushto',
  pt: 'Portuguese',
  qu: 'Quechua',
  rm: 'Romansh',
  rn: 'Rundi',
  ro: 'Romanian, Moldavian, Moldovan',
  ru: 'Russian',
  rw: 'Kinyarwanda',
  sa: 'Sanskrit',
  sc: 'Sardinian',
  sd: 'Sindhi',
  se: 'Northern Sami',
  sg: 'Sango',
  si: 'Sinhala, Sinhalese',
  sk: 'Slovak',
  sl: 'Slovenian',
  sm: 'Samoan',
  sn: 'Shona',
  so: 'Somali',
  sq: 'Albanian',
  sr: 'Serbian',
  ss: 'Swati',
  st: 'Sotho, Southern',
  su: 'Sundanese',
  sv: 'Swedish',
  sw: 'Swahili',
  ta: 'Tamil',
  te: 'Telugu',
  tg: 'Tajik',
  th: 'Thai',
  ti: 'Tigrinya',
  tk: 'Turkmen',
  tl: 'Tagalog',
  tn: 'Tswana',
  to: 'Tonga (Tonga Islands)',
  tr: 'Turkish',
  ts: 'Tsonga',
  tt: 'Tatar',
  tw: 'Twi',
  ty: 'Tahitian',
  ug: 'Uighur, Uyghur',
  uk: 'Ukrainian',
  ur: 'Urdu',
  uz: 'Uzbek',
  ve: 'Venda',
  vi: 'Vietnamese',
  vo: 'Volapük',
  wa: 'Walloon',
  wo: 'Wolof',
  xh: 'Xhosa',
  yi: 'Yiddish',
  yo: 'Yoruba',
  za: 'Zhuang, Chuang',
  zh: 'Chinese',
  zu: 'Zulu',
};

export interface LanguageOption {
  code: string;
  label: string; // e.g. "English (en)"
}

export const LANGUAGE_OPTIONS: LanguageOption[] = Object.entries(ISO_639_1_LANGUAGES)
  .map(([code, name]) => ({ code, label: `${name} (${code})` }))
  .sort((a, b) => a.label.localeCompare(b.label));

/**
 * Tester: matches any string schema with format "iso639-1-language"
 * e.g. { "type": "string", "format": "iso639-1-language" }
 */
export const languageAutocompleteTester: RankedTester = rankWith(
  5,
  schemaMatches((schema: JsonSchema) => schema.type === 'string' && schema.format === 'iso639-1-language'),
);

const LanguageAutocompleteRenderer = ({
  data,
  handleChange,
  path,
  label,
  required,
  errors,
  visible,
  enabled,
  schema,
}: ControlProps) => {
  if (visible === false) {
    return null;
  }

  const selectedOption = LANGUAGE_OPTIONS.find((option) => option.code === data) ?? null;

  return (
    <>
      <Autocomplete<LanguageOption>
        options={LANGUAGE_OPTIONS}
        className="pt-2"
        value={selectedOption}
        disabled={enabled === false}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.code === value.code}
        onChange={(_event, newValue) => {
          handleChange(path, newValue ? newValue.code : undefined);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            required={required}
            error={Boolean(errors)}
            helperText={errors || undefined}
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />
      <FormHelperText>{schema?.description || ''}</FormHelperText>
    </>
  );
};

export default withJsonFormsControlProps(LanguageAutocompleteRenderer);
