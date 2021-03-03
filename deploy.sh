function deploy() {
    local LOCAL="./"
    local USERNAME=${1}
    local DOMAIN="52.229.156.103"
    local REMOTE="${USERNAME}@${DOMAIN}:/var/www/html/fami01/"
    local DOWNLOAD=${2}
    if [ "$DOWNLOAD" != "--download" ]; then
        # upload
        rsync -rav --delete --filter="dir-merge,- .gitignore" ${LOCAL} ${REMOTE}
    else
        # download
        rsync -rav --delete --exclude=".git" --filter="dir-merge,- .gitignore" ${REMOTE} ${LOCAL}
    fi
}

if [ "$1" == "" ] || [ $# -gt 2 ]; then
    echo Usage: . deploy.sh [USERNAME]
    echo --download: download
else
    deploy ${1} ${2}
fi
