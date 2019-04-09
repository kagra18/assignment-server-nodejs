#!/bin/bash

# CSV to JSON converter.
# Base for script from:
# https://gist.github.com/dsliberty/3de707bc656cf757a0cb#gistcomment-2375472




shopt -s extglob

# Set main variables and header variable used for output.
fileJSON="salar.csv"
SEP=","
header="${fileJSON%.*}"

# Output to user when script is run.
function printMsg
{
    echo ""
    echo '>> Converting '${fileJSON}'...'
    echo ""
}

# Adding an extra "," to lines which end with only one ","
# Code written specifically for 'salar.csv' to ensure correct conversion.
function updateCSV
{
    while IFS=$'\n\r' read -r line
    do
        r=${line: -1}
        s=${line: -2}
        if [[ "$r" == "," ]] && [[ "$s" != ",," ]]
        then
            line="$line,"
        fi
        echo "$line"
    done < "${fileJSON}"
}


# Convert 'salar.csv' to JSON-file.
# Code modified from original script:
# https://gist.github.com/dsliberty/3de707bc656cf757a0cb#gistcomment-2375472
function toJSON
{
    updateCSV > "temp.csv"
    cat "temp.csv" > "${fileJSON}"  #Run update function to update salar.csv
    rm -f "temp.csv"

    data=$(sed '1d' "${fileJSON}")        #Store file in variable
    line_count=$(printf "${data}" | wc -l)


# Convert contents of variable 'data' to JSON layout.
    printf '{
    "'${header}'": [\n'
    row=0
    while IFS=$'\n\r' read -r line; do
        if [[ ${row} -eq 0 ]]; then
            IFS="$SEP" read -ra head_items <<< "${line}"
        else
            IFS="$SEP" read -ra line_items <<< "${line}"
            printf "    \t{\n"
            col=0
            for item in "${line_items[@]}"; do
                printf  "\t    \t\"${head_items[${col}]}\": "
                case ${item} in
                        "")
                        printf "null"
                        ;;
                    \"\")
                        printf "null"
                        ;;
                    \"*\")
                        printf "${item}"
                        ;;
                    *.*.*.*)
                        printf "\"${item}\""
                        ;;
                    null|true|false)
                        printf "${item}"
                        ;;
                    *)
                        printf "\"${item}\""
                        ;;
                esac
                (( col++ ))
                [[ ${col} -lt ${#head_items[@]} ]] && printf ",\n" || printf "\n"
            done
            printf "    \t}"
            [[ ${row} -lt ${line_count} ]] && printf ",\n" || printf "\n"
        fi
        (( row++ ))
    done <<< "${data}"
    printf "    ]\n}"
}

# Create file salar.json
# Print message to user when done
printMsg "${fileJSON}"
toJSON > ''${header}'.json'
echo '>> Success: Created file '${header}'.json'
exit 0
