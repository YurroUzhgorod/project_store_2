document.addEventListener('DOMContentLoaded', function () {
	document.onscroll = function () {
		const header = document.querySelector('.header__inner');
		const scroll = window.scrollY;

		if (scroll > 10) {
			header.classList.add('header-fixed');
		} else {
			header.classList.remove('header-fixed');
		}
	};

	var mixer = mixitup('.pop-food__content');

	const swiper = new Swiper('.swiper', {
		loop: true,

		pagination: {
			el: '.swiper-pagin',
			clickable: true,
		},

		navigation: {
			nextEl: '.swiper-btn--prev',
			prevEl: '.swiper-btn--next',
		},
	});
});
