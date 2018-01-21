// 测试　postcss
const postcss = require("postcss");
const root = postcss.parse(
	".a,.b { font-size: 18px }@media screen and (width:800px){width: 200px;}"
);

for (const rule of root.nodes) {
	console.log(rule.selector);
	for (const decl of rule.nodes) {
		console.log(decl.prop);
		console.log(decl.value);
	}
}

root.walkAtRules("media", rule => {
	if (rule.params.indexOf("px") === -1) return;
	rule.params = rule.params.replace();
});
