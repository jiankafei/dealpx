/**
 * Author Zr
 * 注意：
 * １．黑名单选择器只能是单个选择器(a,b{...})不被允许
 * ２．黑名单选择器里的所有px包括font-size都不会被转换
 */
'use strict';
const postcss = require('postcss');

const defaultOptions = {
	unit: 'rem', // 转换到的单位，默认rem(vw | rem)
	ds: 750, // 设计稿像素宽度，默认750
	dpx: 75, // 设计稿大小对应的根字体大小，默认75
	digits: 4, // 单位精度，默认4，none表示不做处理
	excludeRule: [], // 选择器黑名单，元素为string | regexp
	excludeDecl: [], // 属性黑名单，元素为string | regexp
	onePP: true, // 是否1px，默认true
	mediaQuery: false, // 是否转换媒体查询里的单位，默认false
	layout: 414, // 在pc上显示做的额外处理，包括宽度限制，fixed元素居中显示，默认414
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
// 为px单位规则添加媒体查询操作
class PXMediaQueryManage {
	constructor(){
		this.queue = [];
	}
	addToQueue(sel, decl){
		this.queue.push({
			sel,
			decl,
		});
	}
	addToRule(root){
		let sel2 = '';
		let sel3 = '';
		let sel4 = '';
		const re = /(\d*\.?\d+)(?=px)/;
		let px2, px3, px4;
		for (const item of this.queue) {
			px2 = item.decl.value.replace(re, function($1){
				return $1 * 2;
			});
			px3 = item.decl.value.replace(re, function($1){
				return $1 * 3;
			});
			px4 = item.decl.value.replace(re, function($1){
				return $1 * 4;
			});
			sel2 += `${item.sel}{${item.decl.prop}: ${px2};}`;
			sel3 += `${item.sel}{${item.decl.prop}: ${px3};}`;
			sel4 += `${item.sel}{${item.decl.prop}: ${px4};}`;
		}

		root.append(`@media only screen and (-webkit-device-pixel-ratio: 2){${sel2}}
		@media only screen and (-webkit-device-pixel-ratio: 3){${sel3}}
		@media only screen and (-webkit-device-pixel-ratio: 4){${sel4}}
		@media only screen and (min-resolution: 1.5dppx){${sel2}}
		@media only screen and (min-resolution: 2.5dppx){${sel3}}
		@media only screen and (min-resolution: 3.5dppx){${sel4}}`);
		this.queue = [];
	}
}
// 1px边框操作
class BorderManage {
	constructor(){
		this.queue = [];
	}
	addToQueue(rule, decl){
		this.queue.push({
			rule,
			decl,
		});
	}
	addToRule(root){
		const re = /1(?=px)/;
		let v, v2, v3, v4, sel, prop;
		for (const item of this.queue) {
			sel = item.rule.selector;
			prop = item.decl.prop;
			v = item.decl.value;
			v2 = v.replace(re, '0.5');
			v3 = v.replace(re, '0.33333');
			v4 = v.replace(re, '0.25');
			root.append(`.pc ${sel}{${prop}: ${v};}
			@media only screen and (-webkit-device-pixel-ratio: 1){.ios ${sel}{${prop}: ${v};}}
			@media only screen and (-webkit-device-pixel-ratio: 2){.ios ${sel}{${prop}: ${v2};}}
			@media only screen and (-webkit-device-pixel-ratio: 3){.ios ${sel}{${prop}: ${v3};}}
			@media only screen and (-webkit-device-pixel-ratio: 4){.ios ${sel}{${prop}: ${v4};}}
			.droid ${sel}{position: relative;}
			.droid ${sel}:after{content: \'\\2002\';position: absolute;left: 0;top: 0;transform-origin: 0 0;${prop}: ${v};pointer-events: none;}
			@media only screen and (min-resolution: 1.5dppx){.android ${sel}:after{width: 200%;height: 200%;transform: scale3d(.5,.5,1);}}
			@media only screen and (min-resolution: 2.5dppx){.android ${sel}:after{width: 300%;height: 300%;transform: scale3d(.33333,.33333,1);}}
			@media only screen and (min-resolution: 3.5dppx){.android ${sel}:after{width: 400%;height: 400%;transform: scale3d(.25,.25,1);}}`);
			// 删除当前border
			item.decl.remove();
		}
		this.queue = [];
	}
}
// pc显示操作
class PCLayoutManage {
	constructor(){
		this.queue = [];
	}
	addToQueue(sel){
		this.queue.push(sel);
	}
	addToRule(root, layout){
		let sel = '';
		for (const item of this.queue) {
			sel += `,${item}`;
		}
		root.append(`${sel}{left: 0 !important;right: 0 !important;margin-left: auto !important;margin-right: auto !important;width: ${layout}px !important;}`);
		this.queue = [];
	}
}
//添加新规则
function addGlobalRule(root, layout){
	root.append(`.pc *::-webkit-scrollbar{display: none !important}html.pc{margin-left: auto !important;margin-right: auto !important;width: ${layout}px !important;}`);
}
// 银行家舍入法
function toFixed(num, d){
	const re = new RegExp(`^(\\d*\\.\\d{${d-1}})(\\d)(\\d)`);
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
	// 排除　'' "" url()
	const pxRegExp = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)px/ig;
	// 替换操作的回调函数
	const replaceFn = (m, p1) => {
		if (!p1) return m;
		const pixels = parseFloat(p1);
		if (pixels <= 1) return m;
		if (options.unit === 'rem') return toFixed(pixels / options.dpx, options.digits) + options.unit; // rem单位，和rpx配套
		else return toFixed(pixels / options.ds * 100, options.digits) + options.unit; // vw单位
	};
	const pxmqMng = new PXMediaQueryManage();
	const brMng = new BorderManage();
	const pclyMng = new PCLayoutManage();
    return root => {
		// AST处理
        root.walkRules(rule => {
			// 单个规则处理
			if (isExclude(rule.selector, options.excludeRule)) return;
			rule.walkDecls((decl, i) => {
				// 处理pc上fixed显示
				if (decl.value.indexOf('fixed') !== -1) pclyMng.addToQueue(rule.selector);
				// px单个声明处理
				if (decl.value.indexOf('px') === -1) return; // 值没有px则直接返回
				if (decl.prop.indexOf('font') !== -1) { // 处理字体
					switch (options.fontSize) {
						case 'convert':
							decl.value = decl.value.replace(pxRegExp, replaceFn);
							break;
						case 'media':
							pxmqMng.addToQueue(rule.selector, decl);
							break;
					}
				} else if (decl.prop.indexOf('border') !== -1 && decl.value.indexOf('1px') !== -1) { // 处理1px
					brMng.addToQueue(rule, decl);
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
		// 添加规则
		addGlobalRule(root, options.layout);
		pxmqMng.queue.length !== 0 && pxmqMng.addToRule(root);
		brMng.queue.length !== 0 && brMng.addToRule(root);
		pclyMng.queue.length !== 0 && pclyMng.addToRule(root, options.layout);
    };
});
