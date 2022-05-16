---
layout: default
title: Home
hide_title: true
comments: true
weight: 1
---

<script type="text/javascript">
	function getBrowserLanguage() {
	    var language = navigator.language ||   // All browsers
	               (navigator.languages && navigator.languages[0]) || // Chrome / Firefox
	               navigator.userLanguage; // IE <= 10

	    return language;
	}

	function detectLanguage() {
	    var language = getBrowserLanguage();
	    return language.split('-')[0].toLowerCase();
	}

	var userLang = detectLanguage();

	switch (userLang) {
		case 'uk':
			window.location.href = '{{ site.baseurl }}/ua/';
			break;
		case 'ru':
		case 'be':
			window.location.href = '{{ site.baseurl }}/ru/';
			break;
	}
</script>

{% include main_en.md %}
