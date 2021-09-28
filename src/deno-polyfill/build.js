
const NodeOsToDenoOs = {
	"win32": "windows",
	"darwin": "darwin",
	"linux": "linux"
}
function getOs(){
	return NodeOsToDenoOs[process.platform] ?? process.platform;
}

export const build = {
	os: getOs()
}