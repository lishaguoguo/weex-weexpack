var mimetype = require('./mimetype')
	fs = require('fs')
	path = require('path')

const copy = (entry, output, length) => fs.readdirSync(entry).map(file => {
	var pathname = path.join(entry, file)
	var filepath = pathname.substring(length, pathname.length)

	// console.log(filepath)

	return fs.statSync(pathname).isDirectory() ? 
	fs.exists(path.join(output, filepath), exists => {
		exists ? '' : fs.mkdirSync(path.join(output, filepath))
		copy(pathname, output, length) 
	})
	: fs.writeFileSync(path.join(output, filepath), fs.readFileSync(pathname))
})

const imgLength = './img'.length - 1
const distLength = './dist'.length - 1

copy('./dist', './platforms/android/app/src/main/assets', distLength)
copy('./img', './platforms/android/app/src/main/res/drawable-hdpi', imgLength)
copy('./img', './platforms/android/app/src/main/res/drawable-mdpi', imgLength)
copy('./img', './platforms/android/app/src/main/res/drawable-xhdpi', imgLength)
copy('./img', './platforms/android/app/src/main/res/drawable-xxhdpi', imgLength)
console.log('copy complete!')
