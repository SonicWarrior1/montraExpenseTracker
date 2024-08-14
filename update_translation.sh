#!/bin/bash

ENGLISH_FILE="./src/localization/en.json"
LANG_FILES=("./src/localization/es.json" "./src/localization/jp.json" "./src/localization/hi.json")

# LibreTranslate API endpoint
TRANSLATE_API="https://libretranslate.com/translate"

# Function to translate text
translate_text() {
    local text="$1"
    local target_lang="$2"
    curl -s -X POST "$TRANSLATE_API" \
        -H "Content-Type: application/json" \
        -d "{\"q\":\"$text\",\"source\":\"en\",\"target\":\"$target_lang\"}" \
        | jq -r '.translatedText'
}

# Load English JSON file keys into an array
ENGLISH_KEYS=($(jq -r 'keys[]' "$ENGLISH_FILE"))

for LANG_FILE in "${LANG_FILES[@]}"; do
    # Check if the language file exists
    if [[ ! -f "$LANG_FILE" ]]; then
        echo "Language file $LANG_FILE not found, creating a new one."
        cp "$ENGLISH_FILE" "$LANG_FILE"
    fi

    # Load the language file keys into a variable
    LANG_KEYS=$(jq -r 'keys[]' "$LANG_FILE")

    for KEY in "${ENGLISH_KEYS[@]}"; do
        if ! echo "$LANG_KEYS" | grep -q "^$KEY$"; then
            # Key is missing in the language file, translate it
            VALUE=$(jq -r --arg key "$KEY" '.[$key]' "$ENGLISH_FILE")
            TRANSLATED_VALUE=$(translate_text "$VALUE" "${LANG_FILE%.*}")

            # Update the language file with the new translation
            jq --arg key "$KEY" --arg value "$TRANSLATED_VALUE" \
               '. + {($key): $value}' "$LANG_FILE" > "${LANG_FILE}.tmp" && mv "${LANG_FILE}.tmp" "$LANG_FILE"
        fi
    done
done
