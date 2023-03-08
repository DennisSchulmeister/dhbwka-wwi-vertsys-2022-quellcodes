#! /usr/bin/bash
set -e

BLUE="\033[0;34m"
RED="\033[0;31m"
BOLD="\033[1m"
RESET="\033[0m"

function confirm {
    echo
    echo -e "${BLUE}Bitte ENTER drücken zum Bestätigen${RESET}"
    read
}

# Alte Container stoppen
./stop-docker.sh
echo

# URLs der einzelnen Services ermitteln, um sie dem Anwender anzeigen zu können
API_URL="http://localhost:3000"
 DB_URL="http://localhost:8081"

if [ "$GITPOD_WORKSPACE_URL" != "" ]; then
    # Unter gitpod.io laufen die Services in der Cloud
    export API_URL=${GITPOD_WORKSPACE_URL//"https://"/"https://3000-"}
    export  DB_URL=${GITPOD_WORKSPACE_URL//"https://"/"https://8081-"}

    echo -ne "$RED"
    echo "======================================================================================================="
    echo "Gitpod.io entdeckt."
    echo
    echo -ne "$BOLD"
    echo "ACHTUNG! ACHTUNG! ACHTUNG!"
    echo "Bitte daran denken, in Gitpod die Ports 3000 und 8081 auf Public zu setzen!"
    echo -ne "$RESET$RED"
    echo "======================================================================================================="
    echo -ne "$RESET"

    confirm
fi

echo "URLs zum Testen der Anwendung:"
echo
echo -e " » ${BOLD}Backend:${RESET}  $API_URL"
echo -e " » ${BOLD}DB-Admin:${RESET} $DB_URL"
confirm

# Container starten
echo -e "Container werden nun gestartet. Zum Beenden ${BOLD}${RED}Strg+C${RESET} drücken!"
echo -e "Oder alternativ ${BOLD}${RED}./stop-docker.sh${RESET} ausführen."
echo
echo -e "${BOLD}Bei Fehlern in der Anwendung bitte hier die Log-Ausgaben prüfen. 😊${RESET}"
confirm
echo

docker compose up

#echo
#echo "Zum Stoppen der Container folgenden Befehl eingeben:"
#echo "./stop-docker-dev.sh"
#echo
