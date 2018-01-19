/**
 * UnitConverter
 * Author Zr
 * 注意：
 * １．黑名单选择器只能是单个选择器(a,b{...})不被允许
 * ２．黑名单选择器里的所有px包括font-size都不会被转换
 */
'use strict';
const postcss = require('postcss');

const defaultOptions = {
	unit: 'rem', // 转换到的单位，默认rem(vw | rem)
	size: 750, // 设计稿像素宽度，默认750
	rpx: 75, // 设计稿大小对应的根字体大小，默认75
	digits: 5, // 单位精度，默认５，none表示不做处理
	excludeRule: [], // 选择器黑名单，元素为string | regexp
	excludeDecl: [], // 属性黑名单，元素为string | regexp
	onePP: false, // border的1px像素是否处理成物理像素1px，默认false
	mediaQuery: false, // 是否转换媒体查询里的单位，默认false
	fontSize: 'none', // 字体大小处理，默认none
		// convert - 转换字体的单位，默认值
		// media - 不转换，但为字体大小添加媒体查询
		// none - 不做任何处理
};

// 判断选择器是否是黑名单选择器
function isExclude(selector, exclude){
	return exclude.some(black => {
		if (selector.indexOf(',') !== -1) throw new Error('selector must be a single selector');
		if (typeof black === 'string') return selector.indexOf(black) !== -1;
		if (black instanceof RegExp) return black.test(selector);
	});
};
// 添加媒体查询
function addMediaQuery(root, selector, decl){
	const px2 = decl.value.replace(/(\d+)(?=px)/, $1 * 2);
	const px3 = decl.value.replace(/(\d+)(?=px)/, $1 * 3);
	const px4 = decl.value.replace(/(\d+)(?=px)/, $1 * 4);
	root.append(`@media only screen and (-webkit-device-pixel-ratio: 2){
		${selector}{${decl.prop}: ${px2};}
	}
	@media only screen and (-webkit-device-pixel-ratio: 3){
		${selector}{${decl.prop}: ${px3};}
	}
	@media only screen and (-webkit-device-pixel-ratio: 4){
		${selector}{${decl.prop}: ${px4};}
	}
	@media only screen and (min-resolution: 1.5dppx){
		${selector}{${decl.prop}: ${px2};}
	}
	@media only screen and (min-resolution: 2.5dppx){
		${selector}{${decl.prop}: ${px3};}
	}
	@media only screen and (min-resolution: 3.5dppx){
		${selector}{${decl.prop}: ${px4};}
	}`);
};
// 银行家舍入法
function toFixed(num, d){
	const re = new RegExp(`^(\d*\.\d{${d-1}})(\d)(\d)`);
	const match = re.exec(num);
	const m1 = match[1];
	const m2 = ~~match[2];
	const m3 = ~~match[3];
	if (m3 === 5) {
		if (m2 % 2 === 0) return m1 + m2; // 偶数
		else return m1 + (m2 + 1); // 奇数
	}
	return num.toFixed(d);
}

// 输出
module.exports = postcss.plugin('post-unit-converter', options => {
	options = Object.assign(Object.create(null), defaultOptions, options);
	const pxRegExp = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)px/ig;
	// 替换操作的回调函数
	const replaceFn = (m, p1) => {
		if (!p1) return m;
		const pixels = parseFloat(p1);
		if (pixels <= 1) return m;
		if (options.unit === 'rem') return toFixed(pixels / options.rpx, digits) + unit; // rem单位，和rpx配套
		else return toFixed(pixels / options.size * 100, options.digits) + options.unit; // vw单位
	};
    return root => {
		// AST处理
        root.walkRules(rule => {
			// 单个规则处理
			if (isExclude(rule.selector, options.exclude)) return;
			rule.walkDecls((decl, i) => {
				// 单个声明处理
				if (decl.value.indexOf('px') === -1) return; // 值没有px则直接返回
				if (decl.prop.indexOf('font') !== -1) { // 处理字体
					switch (options.fontSize) {
						case 'convert':
							decl.value = decl.value.replace(pxRegExp, replaceFn);
							break;
						case 'media':
							addMediaQuery(root, rule.selector, decl);
							break;
					}
				} else if (decl.prop.indexOf('border') !== -1 && options.onePP) { // 处理border
					console.log('处理border');
				} else { // 默认处理
					decl.value = decl.value.replace(pxRegExp, replaceFn);
				}
			});
		});
		// 是否转换媒体查询的查询选项的单位
		if (options.mediaQuery) {
			root.walkAtRules('media', rule => {
				if (rule.params.indexOf('px') === -1) return;
				rule.params = rule.params.replace(pxRegExp, replaceFn);
			});
		}
    };
});