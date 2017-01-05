rmdir /s /q docs
typedoc --out ./docs/ ./app/src/ --name AjandaDocs --hideGenerator --mode file --ignoreCompilerErrors
