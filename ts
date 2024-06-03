#!/bin/bash

# tmux-sessionizer - original script by thePrimeagen
# creates or attaches to tmux session for selected or common directories

# notes:
# - results in the same session name for directories with the same name
# - only supports a single terminal session

# requires $DATA to be set
subdirs=(
~/studies/
~/dev/
~/documents/
~/projects/
~/templates/
)

dirs=(
~/.config/nvim/
~/.local/bin/
)

if [[ $# -eq 1 ]]; then # 1st argument is used as directory
selected=$1
else # otherwise, use fzf to select directory with depth 1
selected=$( echo $(find "${subdirs[@]}" -mindepth 1 -maxdepth 1 -type d ; echo "${dirs[@]}") | tr " " "\n" | fzf)
fi

if [[ -z $selected ]]; then # no directory selected -> exit
exit 0
fi

selected_name=$(basename "$selected" | tr . _) # session name uses directory name
tmux_running=$(pgrep tmux) # check for running instance

if [[ -z $TMUX ]] && [[ -z $tmux_running ]]; then # no running tmux session -> create & attach
tmux new-session -s $selected_name -c $selected
exit 0
fi

if ! tmux has-session -t=$selected_name 2> /dev/null; then # session does not exist -> create
tmux new-session -ds $selected_name -c $selected
fi

tmux switch-client -t $selected_name # switch to session
