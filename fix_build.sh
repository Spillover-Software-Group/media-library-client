# Looks like Rollup is concating this string and breaking the build.
sed -i '' -e "s/\"useInsertionEffect\"/\"use\"+\"InsertionEffect\"/g" ./dist/media_library.es.js
