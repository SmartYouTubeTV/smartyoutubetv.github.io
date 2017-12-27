---
layout: empty
title: Smart YouTube TV
---
## Detecting language...
<script type="text/javascript">
	function getBrowserLanguage() {
	    var language = navigator.languages && navigator.languages[0] || // Chrome / Firefox
	               navigator.language ||   // All browsers
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
		case 'be':
			userLang = 'ru';
			break;
	}

	var langArr = [];
    {% for lang in site.lang %}
      	langArr.push('{{ lang }}');
    {% endfor %}

    if (langArr.indexOf(userLang) == -1)
    	userLang = 'en';

	window.location.href = '{{ site.baseurl }}/' + userLang + '/';
</script>
