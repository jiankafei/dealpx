# dealpx
postcss单位转换插件
配合 [rpx](https://github.com/jiankafei/rpx) 使用

```js
const options = {
	unit: 'rem', // 转换到的单位，默认rem(vw | rem)
	ds: 750, // 设计稿像素宽度，默认750
	dpx: 75, // 设计稿大小对应的根字体大小，默认75
	digits: 4, // 单位精度，默认4，none表示不做处理
	excludeRule: [], // 选择器黑名单，元素为string | regexp
	onePP: true, // 是否1px，默认true
  mediaQuery: false, // 是否转换媒体查询里的单位，默认false
  minRadius: 5, // radius最小半径，默认5，表示小于该值不转换
	fontSize: 'none', // 字体大小处理，默认none
		// convert - 转换字体的单位，默认值
		// media - 不转换，但为字体大小添加媒体查询
		// none - 不做任何处理
};
```
