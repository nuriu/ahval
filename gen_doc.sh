rm -rf docs
typedoc --out ./docs/ ./app/src/ --name AjandaDocs --hideGenerator --mode file --ignoreCompilerErrors
