/**
 * 设置根字体大小
 * 自己添加meta标签
 * <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
 * G	{Element}	window，不要修改
 * ds	{number}	设计稿大小，默认750
 * dpx	{number}	设计稿大小对应的根字体大小，默认75
 */
;(function(G, ds, dpx){
	'use strict';
	let doc = G.document,
		de = doc.documentElement,
		ua = G.navigator.appVersion,
		maxW = 540, // 最大字体宽度
		tid = null, // timerId
		dt = deviceType(), // 设备类型
		pcStyleEle = null; //给pc添加的样式元素
	ds = ds || 750; // 设计稿大小
	dpx = dpx || 75; // 设计稿大小对应的根字体大小

	// pc上隐藏滚动条，宽度为414，并且为html和定位fixed元素添加宽度
	dt === 'pc' && (pcStyleEle = addStylesheetRules('::-webkit-scrollbar{display: none !important}.fixed{position: fixed !important;left: 0 !important;right: 0 !important;}html, .fixed{margin-left: auto !important;margin-right: auto !important;width: '+ 414 +'px !important;}'));
	dt === 'ios' && de.classList.add('ios');
	dt === 'droid' && de.classList.add('droid');

	// 改变窗口
	G.addEventListener('resize', function () {
		tid = G.setTimeout(setrpx, 300);
	}, false);
	G.addEventListener('pageshow', function (ev) {
		ev.persisted && (clearTimeout(tid), tid = G.setTimeout(setrpx, 300));
	}, false);
	G.orientation !== undefined && G.addEventListener('orientationchange', function(){
		tid = G.setTimeout(setrpx, 300);
	}, false);

	// 执行转换
	setrpx();
	// 设置根字体大小
	function setrpx(){
		let w, rpx;
		w = de.getBoundingClientRect().width;
		w > maxW && (w = maxW);
		rpx = G.parseFloat(w * dpx / ds);
		de.style.fontSize = rpx + 'px';
	};
	// 设备检测
	function deviceType(){
		let dt = 'pc';
		/(?:iPhone|iPod|iPad)/i.test(ua) ? dt = 'ios' : /(?:Android)/i.test(ua) ? dt = 'droid' : /(?:Windows\sPhone)/i.test(ua) ? dt = 'wp' : dt = 'pc';
		return dt;
	};
	// 添加css规则
	function addStylesheetRules(css) {
		let head = de.firstElementChild,
			style = doc.createElement('style');
		style.type = 'text/css';
		style.styleSheet && style.styleSheet.cssText ? style.styleSheet.cssText = css : style.appendChild(doc.createTextNode(css));
		head.appendChild(style);
		return style;
	};
})(window);
