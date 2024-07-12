document.addEventListener('DOMContentLoaded', function () {
	document.onscroll = function () {
		const header = document.querySelector('.header__top')
		const scroll = window.scrollY

		if (scroll > 10) {
			header.classList.add('header-fixed')
		} else {
			header.classList.remove('header-fixed')
		}
	}
})
