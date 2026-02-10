import Alpine from 'alpinejs'
import focus from '@alpinejs/focus'
import intersect from '@alpinejs/intersect'
import persist from '@alpinejs/persist'
import setData from './setData.js'
import facets from './facets.js'
import product from './product.js'
import slider from './slider.js'
import cookiesBanner from './cookiesBanner.js'
window.Alpine = Alpine
Alpine.plugin(focus)
Alpine.plugin(intersect)
Alpine.plugin(persist)
Alpine.data('setData', setData)
Alpine.data('facets', facets)
Alpine.data('product', product)
Alpine.data('slider', slider)
Alpine.data('cookiesBanner', cookiesBanner)
Alpine.start()

/* https://github.com/madmurphy/cookies.js (GPL3) */
!function(){function e(e,o,t,n,r,s,i){var c="";if(t)switch(t.constructor){case Number:c=t===1/0?"; expires=Fri, 31 Dec 9999 23:59:59 GMT":"; max-age="+t;break;case String:c="; expires="+t;break;case Date:c="; expires="+t.toUTCString()}return encodeURIComponent(e)+"="+encodeURIComponent(o)+c+(r?"; domain="+r:"")+(n?"; path="+n:"")+(s?"; secure":"")+(i&&"no_restriction"!==i.toString().toLowerCase()?"lax"===i.toString().toLowerCase()||1===Math.ceil(i)||!0===i?"; samesite=lax":"none"===i.toString().toLowerCase()||i<0?"; samesite=none":"; samesite=strict":"")}var o=/[\-\.\+\*]/g,t=/^(?:expires|max\-age|path|domain|secure|samesite|httponly)$/i;window.docCookies={getItem:function(e){return e&&decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(e).replace(o,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null},setItem:function(o,n,r,s,i,c,a){return!(!o||t.test(o))&&(document.cookie=e(o,n,r,s,i,c,a),!0)},removeItem:function(o,t,n,r,s){return!!this.hasItem(o)&&(document.cookie=e(o,"","Thu, 01 Jan 1970 00:00:00 GMT",t,n,r,s),!0)},hasItem:function(e){return!(!e||t.test(e))&&new RegExp("(?:^|;\\s*)"+encodeURIComponent(e).replace(o,"\\$&")+"\\s*\\=").test(document.cookie)},keys:function(){for(var e=document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/),o=e.length,t=0;t<o;t++)e[t]=decodeURIComponent(e[t]);return e},clear:function(e,o,t,n){for(var r=this.keys(),s=r.length,i=0;i<s;i++)this.removeItem(r[i],e,o,t,n)}}}(),"undefined"!=typeof module&&void 0!==module.exports&&(module.exports=docCookies);


// Click counter
function setClickCount(){    
	if (localStorage['clickCount'] === undefined) {
		localStorage['clickCount'] = 0;
	}
}
setClickCount();

const links = document.querySelectorAll('a');
links.forEach(link => {
    link.addEventListener('click', function(event) {
		setClickCount();
        var currentValue = parseInt(localStorage['clickCount']);
		localStorage['clickCount'] = currentValue + 1;
    });
});

// Site loader
window.addEventListener('load', (event) => {
	document.querySelector('.page-loader').style.opacity = 0;
	setInterval(function () {
		document.querySelector('.page-loader').style.display = 'none';
	}, 640);
	document.querySelector('body').style.overflow = 'auto';
});

// Scroll direction detection
let scrollPos = 0;
let sticky = false;
const header = document.getElementById('header');
const banner = document.getElementById('global-banner');
if(header){
	window.addEventListener('scroll', function(){
		const headerHeight = header.offsetHeight;
		if (screen.width > 767){ var bannerTop = 40 } else { var bannerTop = 16 }
		if (scrollPos >= 0) {
			header.classList.remove("animate");
			sticky = false;
		} 
		if ((document.body.getBoundingClientRect()).top > scrollPos) {
			if (scrollPos < -headerHeight){
				header.classList.add("animate");
				header.style.top = 0;
				if (banner) { 
					banner.classList.add("animate"); 
					banner.style.top = (headerHeight-8)+'px';
				}
				sticky = true;
			} else {
				if ( sticky == false && banner ){
					if (scrollPos > -(headerHeight-bannerTop)){
						banner.style.top = ((headerHeight-8)+scrollPos)+'px';
					} else {
						banner.style.top = bannerTop+"px";
					}
				}
			}
		} else {
			header.style.top = -headerHeight+'px';
			if (banner) { banner.style.top = bannerTop+"px"; }
			if (scrollPos > -(headerHeight-bannerTop) && banner ){
				banner.style.top = ((headerHeight-8)+scrollPos)+'px';
			}
		}
		scrollPos = (document.body.getBoundingClientRect()).top;
	});
};

// Set location select width
const elements = document.querySelectorAll('.select_fix');
let changeWidth = (obj, index) => {
	let text = obj.options[obj.selectedIndex].text;
	let box = document.createElement("box");
	box.innerHTML += text;
	obj.after(box);
	let newWidth = box.offsetWidth;
	box.remove();
	obj.style.width = newWidth+"px";
}
window.onload = function() {
	elements.forEach((item, i) => {
		changeWidth(item, i);
		item.addEventListener('change', function(){
			changeWidth(item, i);
		})
	});
}

// Sign up banner
let signupBanner = document.querySelector(".signup-banner");
if (signupBanner){
	window.addEventListener("scroll", function() {
		let newPosition = (window.innerHeight * 1.2) + Math.round(window.scrollY / 4)
		signupBanner.style.top = newPosition + "px";
	});
}