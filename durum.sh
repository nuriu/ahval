echo
echo "$(tput setaf 3)GÜNLÜK: $(tput sgr 0)"
echo
git log --all --graph --pretty=format:'%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative

echo
echo "$(tput setaf 3)DURUM: $(tput sgr 0)"
echo
git status -sb
echo