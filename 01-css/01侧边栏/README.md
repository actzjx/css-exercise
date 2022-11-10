---
title: CSS-侧边栏

date: 2022-11-10

category: css

duration: 12min

description: css练习要点记录
---

> 本文取材于[bilibili 前端小智](https://www.bilibili.com/video/BV1S84y1v7Pq)，想了解更多请自行移步观看。
>
> 完整代码请前往[github](https://github.com/actzjx/css-exercise/tree/main/01-css/01%E4%BE%A7%E8%BE%B9%E6%A0%8F)。

<img src="https://oss.zhuruyi.cn/blog/Kapture%202022-11-10%20at%2011.04.00.gif" style="zoom:67%;" />

## 整体分析

---

侧边栏分为上下两个部分，上部分的是折叠按钮，下部分是菜单列表，按状态不同又可分为折叠和展开的互动样式。

折叠按钮和菜单都会在不同的状态下呈现不同的样式，中间都有过渡动画。

## 技术点拆解

### inset

```html
<div class="navigation"></div>
```

```css
.navigation {
  position: fixed;
  width: 75px;
  inset: 20px 0 20px 20px;
  background: #fff;
  transition: 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

注意，这里用的是绝对定位，但没有`height`的值，用的是`inset`属性，高度自动撑满窗口。

**inset 属性用作定位元素的 top、right、bottom、left 这些属性的简写。类似于 margin 和 padding 属性，依照“上右下左”的顺序。inset 属性只作用于定位元素。Internet Explorer 浏览器上不支持该属性！**

```css
inset: 0;
/* 等同于 `top: 0; right: 0; bottom: 0; left: 0;` */

inset: 1px 2px;
/* 等同于 `top: 1px; right: 2px; bottom: 1px; left: 2px;` */

inset: 1px 2px 3px;
/* 等同于 `top: 1px; right: 2px; bottom: 3px; left: 2px;` */

inset: 1px 2px 3px 4px;
/* 等同于 `top: 1px; right: 2px; bottom: 3px; left: 4px;` */
```

所以对于定位元素（_absolute_，_fixed_）的大小，确定了宽度`width`之后，再确定另外 3 边与父元素的距离，就自动计算出了高度。属于一个**小技巧**。

### 折叠按钮

```html
<div class="navigation">
  <div class="menu-toggle"></div>
</div>
```

没错就只有一个元素，但是从图中看是有三个横线呀？

其实用的是伪元素`::before`和`::after`，这两个伪元素能在原 Element 的前面或后面增加另一個 Element，但通过`flex`布局，可以将这两个元素居中进行展示，之后将两个伪元素使用`tansform`上下平移相同距离，就形成了上下两道横线，那中间的呢？使用`box-shadow`。

```css
.menu-toggle::after {
  content: '';
  position: absolute;
  width: 30px;
  height: 2px;
  transform: translateY(8px);
  background: #3d4152;
  box-shadow: 0 -8px 0 0 #3d4152;
  transition: all 0.3s ease;
}
```

这里的`boxshadow`属性没有指定阴影扩散半径，那么此时**阴影与元素同样大**。

```css
/* 插页 (阴影向内) | x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
box-shadow: inset 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
```

可以设置多道阴影，用逗号分割开，注意不要理解为上又下左的那种单边阴影。

以上就实现了三条横线，然后通过点击动作追加展开的类就行，这里不做细节描述。

```js
const navigation = document.querySelector('.navigation')

const menuToggle = document.querySelector('.menu-toggle')

menuToggle.onclick = function () {
  navigation.classList.toggle('navigation--open')
}
```

这里使用了`classList.toggle`的语法，当类列表中不存在指定类时添加，存在时删除，很方便。

上面提到了伪元素，那就说说伪元素和伪类的区别：

- 伪类能够在**特定动作**时改变 DOM 的**CSS 样式**，跟选择器有关，不存在于 DOM 中，伪类前面只有一个冒号`:first-child`。
- 伪元素则是基于原有的 DOM，创造文档树之外的对象。伪元素也是元素，只不过不存在与 dom 对象中，但是浏览器审查元素的时候能看得到的。伪元素后面有 2 个冒号`::before`。

**一句话是伪元素产生新对象，在 DOM 树中看不到（审查元素的时候可以看到），但是可以操作；伪类不产生新的对象，仅是 DOM 中一个元素的不同状态。**

### 菜单列表

```html
<li class="menu-item" style="--clr: #2196f3;">
  <a href="#">
    <span class="icon"><ion-icon name="person-outline"></ion-icon></span>
    <span class="title">About</span>
  </a>
</li>
```

每一个菜单项都有其主题色，采用的是 css 变量`var`，注意 css 变量有空格尾随性。另外变量也是跟着 CSS 选择器走的，如果变量所在的选择器和使用变量的元素没有交集，是没有效果的。当存在多个同样名称的变量时候，变量的覆盖规则由 CSS 选择器的权重决定的，但并无`!important`这种用法，因为没有必要。

更多关于 css 的变量请查看[小 tips:了解 CSS 变量 var](https://www.zhangxinxu.com/wordpress/2016/11/css-css3-variables-var/)。

另外就是 icon 的素材来自于[ionicons](https://ionic.io/ionicons)。

关于 icon 值得留意的是，icon 相对于父元素来说偏上，这边使用的是`line-height`结合`height`进行解决的。

```css
.menu-item a .icon {
  position: relative;
  min-width: 55px;
  height: 55px;
  /* line-height 要比 height 大一点 */
  line-height: 60px;
  transition: 0.5s;
  color: #222;
  border-radius: 10px;
  font-size: 1.75em;
  transition: background 0.3s;
}
```

最后就是关于毛玻璃效果，最开始我以为图标周围的渐变效果是使用的阴影达成的，结果是有的`filter`结合伪元素实现的。

```css
.menu-item a .icon::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0px;
  width: 100%;
  height: 100%;
  background: var(--clr);
  filter: blur(8px);
  opacity: 0;
}
```

其实也可以`filter:drop-shadow`，个人感觉效果比 box-shadow 更加柔和，具体请看[CSS3 filter:drop-shadow 滤镜与 box-shadow 区别应用](https://www.zhangxinxu.com/wordpress/2016/05/css3-filter-drop-shadow-vs-box-shadow/)，但就是兼容性有点问题。
