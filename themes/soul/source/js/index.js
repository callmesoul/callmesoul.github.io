var spaceBetween = document.documentElement.clientWidth > 1000 ? 30 : 0;
function getSwiperPrams() {
	var windowsWidth = document.documentElement.clientWidth;
	var slidesPerView;
	var direction;
	if (windowsWidth > 1500) {
		direction = 'horizontal';
		slidesPerView = 4;
	} else if (windowsWidth > 1100) {
		direction = 'horizontal';
		slidesPerView = 3;
	} else if (windowsWidth > 1000) {
		direction = 'horizontal';
		slidesPerView = 2;
	} else {
		slidesPerView = 1;
		direction = 'vertical';
	}
	return {
		direction: direction,
		slidesPerView: slidesPerView,
	};
}
var params = getSwiperPrams();
var mySwiper = new Swiper('.swiper-container', {
	direction: params.direction, // 垂直切换选项
	mousewheel: true,
	slidesPerView: params.slidesPerView,
	spaceBetween,
	scrollbar: {
		el: '.swiper-scrollbar',
	},
	on: {
		resize: function () {},
	},
	// 如果需要滚动条
	scrollbar: {
		el: '.swiper-scrollbar',
	},
});

// 获取更多文章
function getMorePost(page) {
	const disabled = $('.post-item.more').attr('disabled');
	if (disabled) {
		return;
	}
	$('.post-item.more span').css('display', 'none');
	$('.post-item.more #more-loading').css('display', 'flex');
	setTimeout(() => {
		fetch('/page/' + page + '/', { 'Content-Type': 'text/html' })
			.then((res) => res.text())
			.then(function (html) {
				const parser = new DOMParser();
				const dom = parser.parseFromString(html, 'text/html');
				const boydPostList = document.querySelectorAll('.post-item');
				mySwiper.removeSlide(boydPostList.length - 1);
				const postList = dom.querySelectorAll('.post-item');
				for (var i = 0; i < postList.length; i++) {
					mySwiper.appendSlide(postList[i]);
				}
			});
	}, 1000);
}

// 显示文章详情
function showpostDetail(page) {
	var head = document.getElementsByTagName('head')[0];
	// 先加载文章详情要使用的代码高亮 prettify
	const prettifyJs = document.getElementById('prettifyJs');
	if (!prettifyJs) {
		var script = document.createElement('script');
		script.src =
			'https://cdn.bootcdn.net/ajax/libs/prettify/r298/prettify.min.js';
		script.id = 'prettifyJs';
		script.type = 'text/javascript';
		head.appendChild(script);
	}
	fetch(page, { 'Content-Type': 'text/html' })
		.then((res) => res.text())
		.then(function (html) {
			const parser = new DOMParser();
			const dom = parser.parseFromString(html, 'text/html');
			const postDetailHtml = dom.querySelectorAll('.post');
			// 插入文章详情
			$('#post-detail-modal').html(postDetailHtml);
			// 设置代码高亮
			const pres = document.getElementsByTagName('pre');
			for (var i = 0; i < pres.length; i++) {
				pres[i].className = 'prettyprint linenums';
				pres[i].style.overflow = 'auto';
			}
			prettyPrint();
			//  初始化 Gitalk 评论
			if (gitalk.enable) {
				var _gitalk = new Gitalk({
					clientID: gitalk.clientID,
					clientSecret: gitalk.clientSecret,
					repo: gitalk.repo,
					owner: gitalk.owner,
					admin: gitalk.admin,
					id: $('#uuid').attr('uuid'), // Ensure uniqueness and length less than 50
					distractionFreeMode: false, // Facebook-like distraction free mode
        });
        _gitalk.render('gitalk-container');
			}

			// 执行广告script
			try {
				(adsbygoogle = window.adsbygoogle || []).push({});
			} catch (error) { }
			
			document.getElementById('post-detail-modal').style.bottom = 0;
		});
}

// 隐藏文章详情弹窗
function hienPostDetailModal() {
	document.getElementById('post-detail-modal').style.bottom = '-101%';
}
