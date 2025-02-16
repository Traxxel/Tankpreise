#!/bin/bash

# Prüfe ob die benötigten Parameter vorhanden sind
if [ "$#" -lt 2 ]; then
    echo "Verwendung: $0 <api_url> <db_connection>"
    echo "Beispiel: $0 http://example.com:5500/api 'Host=db.example.com;Database=Tankpreise;Username=user;Password=pass'"
    exit 1
fi

API_URL=$1
DB_CONNECTION=$2

# Erstelle die neue config.js
cat > dist/config.js << EOL
window.TANKPREISE_CONFIG = {
    API_BASE_URL: '${API_URL}',
    DB_CONNECTION: '${DB_CONNECTION}'
};
EOL

echo "Konfiguration wurde aktualisiert!"
echo "API URL: ${API_URL}"
echo "DB Connection: ${DB_CONNECTION}" 