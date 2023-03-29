export REACT_APP_PLAYGROUND_ONLY='TRUE'
export REACT_APP_VERSION=$(date +"%Y-%m-%dT%H:%M:%S%z")
export REACT_APP_ENVIRONMENT='pages'
export REACT_APP_MODULE_BACKEND_URL=https://source-academy.github.io/modules
export SW_EXCLUDE_REGEXES='["^/source", "^/sicp", "^/modules", "^/ev3-source"]'
export PUBLIC_URL='https://rohit0718.github.io/sml-slang-frontend'

git branch -D deploy
git checkout -b deploy
yarn install
yarn run build
ln -s index.html build/playground.html
ln -s index.html build/contributors.html
ln -s index.html build/sourcecast.html

cp -r ./build/* .
rm -rf build/*

git add .
git commit -m "deploy"
git push --force origin deploy

git checkout main